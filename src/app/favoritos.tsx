import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

import { useFavorites } from "@/contexts/FavoritesContext";
import { colors } from "@/lib/theme";

export default function Favoritos() {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Favoritos</Text>

      {favorites.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Nenhum favorito ainda</Text>
        </View>
      ) : (
        favorites.map((vehicle) => (
          <View key={vehicle.nome} style={styles.card}>
            <Text style={styles.vehicle}>⭐ {vehicle.nome}</Text>

            <TouchableOpacity onPress={() => removeFavorite(vehicle.nome)}>
              <Text style={styles.remove}>Remover</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
  },
  emptyBox: {
    backgroundColor: colors.card,
    padding: 30,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 14,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  vehicle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
    flexShrink: 1,
    marginRight: 10,
  },
  remove: {
    color: colors.accent,
    fontWeight: "bold",
  },
});
