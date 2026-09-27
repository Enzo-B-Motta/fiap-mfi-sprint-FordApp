import { get } from "./transport";
import { CarApiError } from "./errors";
export { CarApiError } from "./errors";

export type Trim = {
  id: number;
  year: number;
  make: string;
  model: string;
  submodel?: string | null;
  trim?: string | null;
  description?: string | null;
};
type Collection<T> = { data: T[]; collection?: { pages?: number } };
type Engine = {
  trim_id?: number; horsepower_hp?: number | null; torque_ft_lbs?: number | null;
  size?: number | null; cylinders?: string | null; engine_type?: string | null;
  fuel_type?: string | null; transmission?: string | null; drive_type?: string | null;
};
type Mileage = { trim_id?: number; combined_mpg?: number | null };
type Body = { trim_id?: number; type?: string | null };
export type VehicleData = { trim: Trim; engine: Engine | null; mileage: Mileage | null; body: Body | null };

async function collection<T>(path: string, params: Record<string, string | number>): Promise<T[]> {
  const first = await get<Collection<T>>(path, { ...params, page: 1, limit: 100 });
  if (!Array.isArray(first.data)) throw new CarApiError("Formato de lista inesperado da CarAPI.", "response");
  const pages = first.collection?.pages ?? 1;
  if (pages > 5) throw new CarApiError("Pesquisa muito ampla. Informe a versão para reduzir os resultados.", "response");
  const data = [...first.data];
  for (let page = 2; page <= pages; page++) {
    const next = await get<Collection<T>>(path, { ...params, page, limit: 100 });
    if (!Array.isArray(next.data)) throw new CarApiError("Página inválida da CarAPI.", "response");
    data.push(...next.data);
  }
  return data;
}

const normalized = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();

export async function searchTrims(marca: string, modelo: string, versao: string, ano: string): Promise<Trim[]> {
  const year = ano.trim() ? Number(ano) : 2020;
  if (!Number.isInteger(year) || year < 2015 || year > 2020) {
    throw new CarApiError("Informe um ano entre 2015 e 2020.", "response");
  }
  const rows = await collection<Trim>("/trims/v2", { make: marca.trim(), model: modelo.trim(), year });
  return rows.filter((t) => normalized(t.make) === normalized(marca) &&
    normalized(t.model) === normalized(modelo) && t.year === year &&
    (!versao.trim() || [t.trim, t.submodel, t.description].some((v) => normalized(v ?? "").includes(normalized(versao)))))
    .slice(0, 80);
}

export async function loadTrim(trim: Trim): Promise<VehicleData> {
  const params = { trim_id: trim.id };
  const [engines, mileages, bodies] = await Promise.all([
    collection<Engine>("/engines/v2", params),
    collection<Mileage>("/mileages/v2", params),
    collection<Body>("/bodies/v2", params),
  ]);
  const correct = <T extends { trim_id?: number }>(rows: T[]) => rows.find((r) => Number(r.trim_id) === trim.id) ?? null;
  return { trim, engine: correct(engines), mileage: correct(mileages), body: correct(bodies) };
}
