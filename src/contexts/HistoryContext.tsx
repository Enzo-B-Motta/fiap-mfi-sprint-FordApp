import React, { createContext, useContext, useState, ReactNode } from "react";

import { Vehicle } from "@/lib/types";

interface HistoryContextData {
  history: Vehicle[];
  addHistory: (vehicle: Vehicle) => void;
}

const HistoryContext = createContext<HistoryContextData | undefined>(
  undefined
);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<Vehicle[]>([]);

  function addHistory(vehicle: Vehicle) {
    setHistory((prev) => {
      const alreadyExists = prev.some((item) => item.nome === vehicle.nome);
      if (alreadyExists) {
        return prev;
      }
      return [vehicle, ...prev];
    });
  }

  return (
    <HistoryContext.Provider value={{ history, addHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error("useHistory deve ser usado dentro de um HistoryProvider");
  }
  return context;
}
