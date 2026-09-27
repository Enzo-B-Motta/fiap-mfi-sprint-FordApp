import React, { useState } from "react";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useVehicles } from "@/contexts/VehiclesContext";
import { colors } from "@/lib/theme";
import { RANGER_RAPTOR } from "@/lib/vehicles";
import { Vehicle } from "@/lib/types";

const display = (value: string | number | null) => value == null || value === "" ? "Não informado" : String(value);

function Bar({ label, unit, first, second }: { label: string; unit: string; first: number | null; second: number | null }) {
  if (first == null || second == null) return (
    <View style={styles.card}><Text style={styles.heading}>{label}</Text><Text style={styles.text}>Comparação indisponível: falta dado em um dos veículos.</Text></View>
  );
  const max = Math.max(first, second, 1);
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>{label}</Text>
      <Text style={styles.text}>Ranger Raptor: {first} {unit}</Text>
      <View style={styles.track}><View style={[styles.blue, { width: `${100 * first / max}%` }]} /></View>
      <Text style={styles.text}>Concorrente: {second} {unit}</Text>
      <View style={styles.track}><View style={[styles.gray, { width: `${100 * second / max}%` }]} /></View>
    </View>
  );
}

export default function Comparar() {
  const { vehicles, error, remove } = useVehicles();
  const { addFavorite } = useFavorites();
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [localError, setLocalError] = useState("");
  const rivals = vehicles.filter((v) => v.id !== RANGER_RAPTOR.id && v.fonte === "CarAPI");
  const selected: Vehicle | undefined = rivals.find((v) => v.id === selectedId) ?? rivals[0];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Comparar veículos</Text>
      <Text style={styles.note}>Ranger Raptor: ficha cadastrada manualmente (Brasil, 2024). Concorrentes: versões consultadas na CarAPI e salvas no banco local.</Text>
      {!!(error || localError) && <Text style={styles.warning}>{error || localError}</Text>}
      {rivals.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.text}>Ainda não há concorrentes salvos.</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push("/pesquisa")}>
            <Text style={styles.text}>Pesquisar concorrente →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.heading}>Concorrentes salvos</Text>
          {rivals.map((v) => (
            <View key={v.id} style={[styles.card, selected?.id === v.id && styles.selected]}>
              <TouchableOpacity onPress={() => setSelectedId(v.id)}>
                <Text style={styles.text}>{v.nome}</Text>
                <Text style={styles.note}>Toque para comparar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => remove(v.id).catch(() => setLocalError("Não foi possível remover do banco."))}>
                <Text style={styles.warning}>Remover do banco</Text>
              </TouchableOpacity>
            </View>
          ))}
          {selected && <>
            <Text style={styles.heading}>Ranger Raptor × {selected.nome}</Text>
            <TouchableOpacity style={styles.button} onPress={() => addFavorite(selected)}>
              <Text style={styles.text}>⭐ Favoritar concorrente</Text>
            </TouchableOpacity>
            <Bar label="Potência" unit="cv" first={RANGER_RAPTOR.specs.Potência} second={selected.specs.Potência} />
            <Bar label="Torque" unit="kgfm" first={RANGER_RAPTOR.specs.Torque} second={selected.specs.Torque} />
            <Bar label="Consumo" unit="km/l" first={RANGER_RAPTOR.specs.Economia} second={selected.specs.Economia} />
            {(Object.keys(RANGER_RAPTOR.specs) as (keyof Vehicle["specs"])[]).map((key) => (
              <View key={key} style={styles.card}>
                <Text style={styles.heading}>{key}</Text>
                <Text style={styles.text}>Ranger Raptor: {display(RANGER_RAPTOR.specs[key])}</Text>
                <Text style={styles.text}>{selected.nome}: {display(selected.specs[key])}</Text>
              </View>
            ))}
            <Text style={styles.note}>CarAPI: veículos dos EUA, 2015–2020. Potência, torque e consumo foram convertidos para unidades brasileiras; consumo EPA não é diretamente comparável a uma medição brasileira. Campos ausentes não recebem vencedor.</Text>
          </>}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  title: { color: colors.text, fontSize: 29, fontWeight: "bold", textAlign: "center", marginBottom: 15 },
  heading: { color: colors.primary, fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  note: { color: colors.muted, fontSize: 14, lineHeight: 20, marginBottom: 15 },
  text: { color: colors.text, fontSize: 16, marginBottom: 10 },
  warning: { color: colors.accent, fontSize: 14, marginVertical: 8 },
  card: { backgroundColor: colors.card, padding: 16, borderRadius: 12, marginBottom: 12 },
  selected: { borderColor: colors.primary, borderWidth: 2 },
  button: { backgroundColor: colors.primary, padding: 15, borderRadius: 12, marginBottom: 15 },
  track: { height: 14, backgroundColor: colors.barTrack, borderRadius: 8, marginBottom: 15, overflow: "hidden" },
  blue: { height: "100%", backgroundColor: colors.primary },
  gray: { height: "100%", backgroundColor: colors.barSecondary },
});
