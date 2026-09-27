import React from "react";
import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/lib/theme";
import { useVehicles } from "@/contexts/VehiclesContext";
import { RANGER_RAPTOR } from "@/lib/vehicles";

export default function Home() {
  const router = useRouter();
  const { vehicles } = useVehicles();
  const rivals = vehicles.filter((v) => v.id !== RANGER_RAPTOR.id);
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.logo}>FORD AI</Text>
      <Text style={styles.title}>Inteligência competitiva</Text>
      <Text style={styles.subtitle}>Compare a Ranger Raptor cadastrada no app com fichas técnicas de veículos pesquisados na CarAPI.</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/pesquisa")}>
        <Text style={styles.buttonText}>🔍 Pesquisar veículo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/comparar")}>
        <Text style={styles.buttonText}>⚖️ Comparar veículos ({rivals.length})</Text>
      </TouchableOpacity>
      <View style={styles.row}>
        <TouchableOpacity style={styles.secondary} onPress={() => router.push("/historico")}>
          <Text style={styles.buttonText}>🕒 Histórico</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondary} onPress={() => router.push("/favoritos")}>
          <Text style={styles.buttonText}>⭐ Favoritos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Referência: Ford Ranger Raptor</Text>
        <Text style={styles.cardText}>Ficha brasileira cadastrada manualmente: {RANGER_RAPTOR.specs.Potência} cv e {RANGER_RAPTOR.specs.Torque} kgfm.</Text>
        <Text style={styles.note}>Concorrentes salvos no banco local: {rivals.length}. A CarAPI usa versões vendidas nos EUA entre 2015 e 2020 neste protótipo.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  logo: { color: colors.primary, fontSize: 34, fontWeight: "bold", textAlign: "center", marginTop: 20 },
  title: { color: colors.text, fontSize: 27, fontWeight: "bold", textAlign: "center", marginTop: 12 },
  subtitle: { color: colors.muted, textAlign: "center", fontSize: 16, lineHeight: 23, marginVertical: 24 },
  button: { backgroundColor: colors.primary, padding: 18, borderRadius: 14, marginBottom: 14 },
  buttonText: { color: colors.text, fontWeight: "bold", fontSize: 16, textAlign: "center" },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  secondary: { backgroundColor: colors.card, width: "48%", padding: 15, borderRadius: 14 },
  card: { backgroundColor: colors.card, padding: 20, borderRadius: 16, marginTop: 30 },
  cardTitle: { color: colors.primary, fontWeight: "bold", fontSize: 20, marginBottom: 10 },
  cardText: { color: colors.text, fontSize: 16, lineHeight: 23 },
  note: { color: colors.muted, fontSize: 14, lineHeight: 20, marginTop: 12 },
});
