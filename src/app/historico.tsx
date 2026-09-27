import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import { useHistory } from "@/contexts/HistoryContext";
import { colors } from "@/lib/theme";

export default function Historico() {
  const { history } = useHistory();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Histórico</Text>

      {history.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Nenhuma pesquisa ainda</Text>
        </View>
      ) : (
        history.map((vehicle) => (
          <View key={vehicle.nome} style={styles.card}>
            <Text style={styles.vehicle}>{vehicle.nome}</Text>
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
  },
  vehicle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
  },
});
