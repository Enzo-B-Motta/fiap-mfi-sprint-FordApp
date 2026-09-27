import { CarApiError } from "./errors";

// Navegador: a API Route do próprio Expo mantém as credenciais no servidor.
const BASE = "/carapi";
export async function get<T>(path: string, query: Record<string, string | number>): Promise<T> {
  const qs = new URLSearchParams([
    ["resource", path.replace(/^\//, "").replace(/\/v2$/, "")],
    ...Object.entries(query).map(([key, value]) => [key, String(value)]),
  ]).toString();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  let response: Response;
  try { response = await fetch(`${BASE}?${qs}`, { signal: controller.signal }); }
  catch { throw new CarApiError("Não foi possível consultar a rota da CarAPI no Expo. Reinicie com npx expo start.", "network"); }
  finally { clearTimeout(timer); }
  if (!response.ok) {
    let message = `A consulta à CarAPI falhou (HTTP ${response.status}).`;
    try { const body = await response.json(); if (typeof body.message === "string") message = body.message; } catch { /* resposta não JSON */ }
    throw new CarApiError(message, response.status === 401 ? "auth" : response.status === 403 ? "access" : response.status === 429 ? "quota" : "response");
  }
  try { return (await response.json()) as T; }
  catch { throw new CarApiError("O servidor local retornou dados inválidos.", "response"); }
}
