import React, { useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

import { colors } from "@/lib/theme";

export default function Pesquisa() {
  const router = useRouter();

  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [versao, setVersao] = useState("");
  const [ano, setAno] = useState("");
  const [atributos, setAtributos] = useState("");

  const canSearch = marca.trim().length > 0 && modelo.trim().length > 0;

  function handleSearch() {
    if (!canSearch) return;

    router.push({
      pathname: "/resultado",
      params: { marca: marca.trim(), modelo: modelo.trim(), versao: versao.trim(), ano: ano.trim(), atributos: atributos.trim() },
    });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Pesquisar Veículo</Text>

      <TextInput
        placeholder="Marca"
        placeholderTextColor={colors.muted}
        style={styles.input}
        value={marca}
        onChangeText={setMarca}
      />

      <TextInput
        placeholder="Modelo"
        placeholderTextColor={colors.muted}
        style={styles.input}
        value={modelo}
        onChangeText={setModelo}
      />

      <TextInput
        placeholder="Versão"
        placeholderTextColor={colors.muted}
        style={styles.input}
        value={versao}
        onChangeText={setVersao}
      />

      <TextInput
        placeholder="Ano (2015 a 2020; padrão: 2020)"
        placeholderTextColor={colors.muted}
        keyboardType="number-pad"
        maxLength={4}
        style={styles.input}
        value={ano}
        onChangeText={setAno}
      />

      <TextInput
        placeholder="Atributos: potência, torque, motor... (opcional)"
        placeholderTextColor={colors.muted}
        style={styles.input}
        value={atributos}
        onChangeText={setAtributos}
      />

      <Text style={{ color: colors.muted, marginBottom: 8 }}>
        A CarAPI contém veículos vendidos nos EUA. Ex.: Toyota, Tacoma, SR5, 2020.
      </Text>

      <TouchableOpacity
        style={[styles.button, !canSearch && styles.buttonDisabled]}
        onPress={handleSearch}
        disabled={!canSearch}
      >
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    backgroundColor: colors.card,
    color: colors.text,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 14,
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.text,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
