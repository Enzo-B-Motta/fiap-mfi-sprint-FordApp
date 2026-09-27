import React, { createContext, useContext, useState, ReactNode } from "react";

import { Vehicle } from "@/lib/types";

interface FavoritesContextData {
  favorites: Vehicle[];
  addFavorite: (vehicle: Vehicle) => void;
  removeFavorite: (nome: string) => void;
}

const FavoritesContext = createContext<FavoritesContextData | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Vehicle[]>([]);

  function addFavorite(vehicle: Vehicle) {
    setFavorites((prev) => {
      const alreadyExists = prev.some((item) => item.nome === vehicle.nome);
      if (alreadyExists) {
        return prev;
      }
      return [...prev, vehicle];
    });
  }

  function removeFavorite(nome: string) {
    setFavorites((prev) => prev.filter((item) => item.nome !== nome));
  }

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

// Hook de acesso: lança erro se usado fora do FavoritesProvider,
// em vez de retornar undefined silenciosamente.
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error(
      "useFavorites deve ser usado dentro de um FavoritesProvider"
    );
  }
  return context;
}
