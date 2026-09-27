import { Stack } from "expo-router";

import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { HistoryProvider } from "@/contexts/HistoryContext";
import { VehiclesProvider } from "@/contexts/VehiclesContext";
import { colors } from "@/lib/theme";

export default function RootLayout() {
  return (
    <HistoryProvider>
      <FavoritesProvider>
        <VehiclesProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="index" options={{ title: "Início" }} />
          <Stack.Screen
            name="pesquisa"
            options={{ title: "Pesquisar Veículo" }}
          />
          <Stack.Screen
            name="resultado"
            options={{ title: "Resultado da Pesquisa" }}
          />
          <Stack.Screen
            name="comparar"
            options={{ title: "Comparar Veículos" }}
          />
          <Stack.Screen name="historico" options={{ title: "Histórico" }} />
          <Stack.Screen name="favoritos" options={{ title: "Favoritos" }} />
        </Stack>
        </VehiclesProvider>
      </FavoritesProvider>
    </HistoryProvider>
  );
}
