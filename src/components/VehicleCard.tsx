import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { colors } from "@/lib/theme";

interface VehicleCardProps {
  label: string;
  value: string | number | null;
}

export default function VehicleCard({ label, value }: VehicleCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>
        {value === undefined || value === null || value === "" || value === 0
          ? "Não disponível"
          : value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },
  label: {
    color: colors.muted,
    fontSize: 16,
  },
  value: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
  },
});
