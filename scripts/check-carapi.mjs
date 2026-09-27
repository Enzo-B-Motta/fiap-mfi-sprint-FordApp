import { readFileSync } from "node:fs";

// Diagnóstico local. Não imprime credenciais, JWT nem resposta integral da API.
const env = Object.fromEntries(readFileSync(".env.local", "utf8").split(/\r?\n/)
  .filter((line) => line.includes("=") && !line.trim().startsWith("#"))
  .map((line) => { const at = line.indexOf("="); return [line.slice(0, at).trim(), line.slice(at + 1).trim()]; }));
const api_token = env.EXPO_PUBLIC_CARAPI_TOKEN;
const api_secret = env.EXPO_PUBLIC_CARAPI_SECRET;
if (!api_token || !api_secret) throw new Error("Configure as duas variáveis no .env.local.");

async function report(label, response) {
  console.log(`${label}: HTTP ${response.status}; servidor: ${response.headers.get("server") || "não informado"}`);
  if (!response.ok) throw new Error(`${label} falhou. HTTP ${response.status}. Nenhuma credencial foi exibida.`);
}
const login = await fetch("https://carapi.app/api/auth/login", {
  method: "POST", headers: { "Content-Type": "application/json", Accept: "text/plain" },
  body: JSON.stringify({ api_token, api_secret }),
});
await report("Login", login);
const jwt = (await login.text()).trim().replace(/^"|"$/g, "");
if (jwt.split(".").length !== 3) throw new Error("Resposta do login não contém JWT válido.");

const headers = { Authorization: `Bearer ${jwt}`, Accept: "application/json" };
const trims = await fetch("https://carapi.app/api/trims/v2?make=Toyota&model=Camry&year=2020&limit=1", { headers });
await report("Versões", trims);
const data = await trims.json();
console.log("Versões na amostra:", data.collection?.total ?? data.data?.length ?? "formato inesperado");
if (data.data?.[0]?.id) {
  const engines = await fetch(`https://carapi.app/api/engines/v2?trim_id=${data.data[0].id}&limit=1`, { headers });
  await report("Motor", engines);
  const engineData = await engines.json();
  console.log("Motores na amostra:", engineData.data?.length ?? "formato inesperado");
}
