import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useHistory } from "@/contexts/HistoryContext";
import { useVehicles } from "@/contexts/VehiclesContext";
import Loading from "@/components/Loading";
import VehicleCard from "@/components/VehicleCard";
import { colors } from "@/lib/theme";
import { Vehicle, ResultadoParams } from "@/lib/types";
import { searchTrims, loadTrim, Trim, CarApiError } from "@/lib/api/carapi";

type Status = "loading" | "choose" | "found" | "not-found" | "error";
const round = (n: number) => Math.round(n * 10) / 10;

export default function Resultado() {
  const { marca = "", modelo = "", versao = "", ano = "", atributos = "" } = useLocalSearchParams<ResultadoParams>();
  const router = useRouter();
  const { addFavorite } = useFavorites();
  const { addHistory } = useHistory();
  const { save } = useVehicles();
  const [status, setStatus] = useState<Status>("loading");
  const [candidates, setCandidates] = useState<Trim[]>([]);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;
    searchTrims(marca, modelo, versao, ano).then((items) => {
      if (!active) return;
      setCandidates(items);
      setStatus(items.length ? "choose" : "not-found");
    }).catch((error) => {
      if (!active) return;
      setErrorMessage(error instanceof CarApiError ? error.message : "Erro inesperado ao pesquisar.");
      setStatus("error");
    });
    return () => { active = false; };
  }, [marca, modelo, versao, ano]);

  async function select(candidate: Trim) {
    setStatus("loading");
    try {
      const { engine, mileage, body } = await loadTrim(candidate);
      if (!engine && !mileage && !body) {
        throw new CarApiError("Esta versão não trouxe ficha técnica no acesso atual da CarAPI. Escolha outra versão ou confira o plano da conta.", "access");
      }
      const motor = [engine?.size ? `${engine.size} L` : null, engine?.cylinders, engine?.engine_type]
        .filter(Boolean).join(" ") || "Não informado";
      const selected: Vehicle = {
        id: `carapi-${candidate.id}`,
        nome: `${candidate.make} ${candidate.model} ${candidate.trim || candidate.submodel || ""} (${candidate.year}) – ${candidate.description || "versão"}`,
        fonte: "CarAPI",
        specs: {
          Motor: motor,
          Potência: engine?.horsepower_hp != null ? round(engine.horsepower_hp * 1.0138697) : null,
          Torque: engine?.torque_ft_lbs != null ? round(engine.torque_ft_lbs * 0.13825495) : null,
          Transmissão: engine?.transmission || "Não informado",
          Tração: engine?.drive_type || "Não informado",
          Combustível: engine?.fuel_type || "Não informado",
          Suspensão: "Não informada pela CarAPI",
          Categoria: body?.type || "Não informado",
          Economia: mileage?.combined_mpg != null ? round(mileage.combined_mpg * 0.4251437) : null,
          Ano: candidate.year,
        },
      };
      await save(selected);
      setVehicle(selected);
      addHistory(selected);
      setStatus("found");
    } catch (error) {
      setErrorMessage(error instanceof CarApiError ? error.message : "Não foi possível salvar o veículo no banco local.");
      setStatus("error");
    }
  }

  if (status === "loading") return <Loading label="Consultando a CarAPI..." />;
  if (status === "choose") return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Escolha a versão exata</Text>
      <Text style={styles.note}>As fichas técnicas são dos veículos vendidos nos EUA. Ao escolher uma versão, ela é salva no banco do app.</Text>
      {candidates.map((trim) => (
        <TouchableOpacity key={trim.id} style={styles.option} onPress={() => select(trim)}>
          <Text style={styles.optionText}>{trim.make} {trim.model} {trim.trim || trim.submodel} ({trim.year})</Text>
          <Text style={styles.note}>{trim.description || "Sem descrição adicional"}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
  if (status === "not-found" || status === "error") return (
    <View style={styles.center}>
      <Text style={styles.title}>{status === "error" ? "Não foi possível consultar" : "Nenhuma versão encontrada"}</Text>
      <Text style={styles.note}>{status === "error" ? errorMessage : `Não encontramos ${marca} ${modelo} ${versao} no ano ${ano || "2020"}. A CarAPI cobre veículos comercializados nos EUA; tente outro nome ou ano.`}</Text>
      <TouchableOpacity style={styles.option} onPress={() => candidates.length ? setStatus("choose") : router.replace("/pesquisa")}>
        <Text style={styles.optionText}>{candidates.length ? "Escolher outra versão" : "Nova pesquisa"}</Text>
      </TouchableOpacity>
    </View>
  );
  if (!vehicle) return null;
  const specs = Object.entries(vehicle.specs);
  const requested = atributos.split(",").map((item) => item.trim()).filter(Boolean);
  const normalized = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const shown = requested.length ? requested.map((name) => {
    const found = specs.find(([key]) => normalized(key) === normalized(name));
    return [name, found ? found[1] : "Não disponível nesta fonte"] as const;
  }) : specs;
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Ficha técnica</Text>
      <Text style={styles.name}>{vehicle.nome}</Text>
      <Text style={styles.note}>Fonte: CarAPI (mercado dos EUA). Salvo no banco local para comparar com a Ranger Raptor brasileira.</Text>
      <TouchableOpacity style={styles.favorite} onPress={() => addFavorite(vehicle)}>
        <Text style={styles.optionText}>⭐ Favoritar veículo</Text>
      </TouchableOpacity>
      {shown.map(([key, value], index) => (
        <VehicleCard key={`${key}-${index}`} label={key + (normalized(key) === "potencia" ? " (cv)" : normalized(key) === "torque" ? " (kgfm)" : normalized(key) === "economia" ? " (km/l, EPA)" : "")} value={value} />
      ))}
      <TouchableOpacity style={styles.option} onPress={() => router.push("/comparar")}>
        <Text style={styles.optionText}>Comparar com Ranger Raptor →</Text>
      </TouchableOpacity>
      <Text style={styles.note}>Conversões: hp → cv, lb-ft → kgfm, mpg (EUA) → km/l. Consumo EPA e dados de versões brasileiras podem seguir métodos e especificações diferentes.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  center: { flex: 1, backgroundColor: colors.background, padding: 30, justifyContent: "center" },
  title: { color: colors.text, fontSize: 26, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  name: { color: colors.text, fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  note: { color: colors.muted, fontSize: 14, lineHeight: 20, marginTop: 5, marginBottom: 14 },
  option: { backgroundColor: colors.card, padding: 16, borderRadius: 12, marginBottom: 10 },
  optionText: { color: colors.text, fontSize: 16, fontWeight: "bold" },
  favorite: { backgroundColor: colors.primary, padding: 16, borderRadius: 12, marginBottom: 18 },
});
