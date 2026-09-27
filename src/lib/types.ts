// TaskService/Task: gerado pelo template inicial do projeto.
// Deixado aqui para quando a persistência local (SQLite) for implementada;
// hoje nenhuma tela usa esses tipos.
export interface Task {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
}

export interface TaskService {
  list(): Promise<Task[]>;
  add(title: string): Promise<void>;
  toggle(id: string, done: boolean): Promise<void>;
  remove(id: string): Promise<void>;
}

// ---- Domínio do FordApp ----

export interface VehicleSpecs {
  Motor: string;
  Potência: number | null;
  Torque: number | null;
  Transmissão: string;
  Tração: string;
  Combustível: string;
  Suspensão: string;
  Categoria: string;
  Economia: number | null;
  Ano: number;
}

export interface Vehicle {
  id: string;
  nome: string;
  specs: VehicleSpecs;
  fonte: "manual" | "CarAPI";
}

// Parâmetros recebidos pela rota /resultado (vindos da tela de pesquisa).
// Sempre strings (a Pesquisa envia os três campos, mesmo vazios) — precisam
// ser obrigatórios aqui para bater com o tipo que useLocalSearchParams espera.
export type ResultadoParams = {
  marca: string;
  modelo: string;
  versao: string;
  ano: string;
  atributos: string;
};
