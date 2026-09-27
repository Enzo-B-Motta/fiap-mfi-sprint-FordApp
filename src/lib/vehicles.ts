import { Vehicle } from "./types";

// Registro de referência inserido manualmente no banco local na inicialização.
// Potência e torque: ficha Ford Brasil. Consumo ainda não foi confirmado.
export const RANGER_RAPTOR: Vehicle = {
  id: "ford-ranger-raptor-br-2024",
  nome: "Ford Ranger Raptor 2024 (Brasil)",
  fonte: "manual",
  specs: {
    Motor: "3.0 V6 Bi-Turbo",
    Potência: 397,
    Torque: 59.4,
    Transmissão: "Automática, 10 marchas",
    Tração: "4x4",
    Combustível: "Gasolina",
    Suspensão: "FOX Racing",
    Categoria: "Picape",
    Economia: null,
    Ano: 2024,
  },
};
