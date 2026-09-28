import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function MonitoramentoScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Monitoramento de Segurança</Text>
      <Text style={styles.subtitle}>Ford AI • Observabilidade</Text>

      <View style={styles.cards}>
        <View style={styles.card}>
          <Text style={styles.number}>12</Text>
          <Text style={styles.label}>Entradas rejeitadas</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.number}>3</Text>
          <Text style={styles.label}>Falhas CarAPI</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.number}>2</Text>
          <Text style={styles.label}>Alertas</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Eventos monitorados</Text>

      <View style={styles.event}>
        <Text style={styles.eventTitle}>security_input_rejected</Text>
        <Text>Status 400 • 12 ocorrências</Text>
      </View>

      <View style={styles.event}>
        <Text style={styles.eventTitle}>carapi_request_failed</Text>
        <Text>Status 401 • 2 ocorrências</Text>
        <Text>Status 429 • 1 ocorrência</Text>
      </View>

      <Text style={styles.note}>
        Dados demonstrativos para visualização das métricas definidas no plano
        de monitoramento.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#f5f6f8",
    minHeight: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
    marginBottom: 24,
  },
  cards: {
    gap: 12,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
  },
  number: {
    fontSize: 30,
    fontWeight: "700",
  },
  label: {
    fontSize: 15,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 28,
    marginBottom: 12,
  },
  event: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  eventTitle: {
    fontWeight: "700",
    marginBottom: 6,
  },
  note: {
    marginTop: 20,
    fontSize: 13,
  },
});