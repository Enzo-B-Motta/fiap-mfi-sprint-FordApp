import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";

import { colors } from "@/lib/theme";

interface LoadingProps {
  label?: string;
}

export default function Loading({ label }: LoadingProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  label: {
    color: colors.text,
    marginTop: 15,
    fontSize: 16,
  },
});
