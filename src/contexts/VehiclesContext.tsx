import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Vehicle } from "@/lib/types";
import { RANGER_RAPTOR } from "@/lib/vehicles";
import { listVehicles, saveVehicle, deleteVehicle } from "@/lib/database/vehicles";

type Data = {
  vehicles: Vehicle[];
  error: string | null;
  save: (vehicle: Vehicle) => Promise<void>;
  remove: (id: string) => Promise<void>;
};
const Context = createContext<Data | null>(null);
export function VehiclesProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([RANGER_RAPTOR]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    listVehicles().then((rows) => { if (active) setVehicles(rows); })
      .catch(() => { if (active) setError("Não foi possível abrir o banco local de veículos."); });
    return () => { active = false; };
  }, []);
  async function save(vehicle: Vehicle) {
    await saveVehicle(vehicle);
    setVehicles((rows) => [vehicle, ...rows.filter((row) => row.id !== vehicle.id)]);
  }
  async function remove(id: string) {
    await deleteVehicle(id);
    setVehicles((rows) => rows.filter((row) => row.id !== id));
  }
  return <Context.Provider value={{ vehicles, error, save, remove }}>{children}</Context.Provider>;
}
export function useVehicles() {
  const data = useContext(Context);
  if (!data) throw new Error("useVehicles deve estar dentro de VehiclesProvider");
  return data;
}
