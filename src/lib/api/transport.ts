import { CarApiError } from "./errors";

// Expo Go / APK: chamada direta. O browser usa transport.web.ts.
const BASE = "https://carapi.app/api";
let cachedJwt: string | null = null;
let jwtUntil = 0;
let loginInFlight: Promise<string> | null = null;

async function request(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try { return await fetch(url, { ...options, signal: controller.signal }); }
  catch { throw new CarApiError("Não foi possível alcançar a CarAPI no aparelho. Verifique a conexão.", "network"); }
  finally { clearTimeout(timer); }
}

function credentials() {
  const api_token = process.env.EXPO_PUBLIC_CARAPI_TOKEN;
  const api_secret = process.env.EXPO_PUBLIC_CARAPI_SECRET;
  if (!api_token || !api_secret) throw new CarApiError(
    "Credenciais ausentes. Configure EXPO_PUBLIC_CARAPI_TOKEN e EXPO_PUBLIC_CARAPI_SECRET no .env.local e reinicie o Expo.", "config");
  return { api_token, api_secret };
}

function statusError(status: number, loginRequest: boolean): CarApiError {
  if (status === 401) return new CarApiError(
    loginRequest ? "Token ou API Secret rejeitado no login (401)." : "JWT rejeitado mesmo após renovar.", "auth");
  if (status === 403) return new CarApiError("A CarAPI bloqueou o acesso (403). Confira o plano e a rede.", "access");
  if (status === 429) return new CarApiError("Limite de requisições da CarAPI atingido (429).", "quota");
  return new CarApiError(`CarAPI respondeu com HTTP ${status}.`, "response");
}

async function login(): Promise<string> {
  const response = await request(`${BASE}/auth/login`, {
    method: "POST", headers: { "Content-Type": "application/json", Accept: "text/plain" },
    body: JSON.stringify(credentials()),
  });
  if (!response.ok) throw statusError(response.status, true);
  const jwt = (await response.text()).trim().replace(/^"|"$/g, "");
  if (jwt.split(".").length !== 3) throw new CarApiError("Login respondeu sem JWT válido.", "response");
  cachedJwt = jwt;
  jwtUntil = Date.now() + 6 * 24 * 60 * 60 * 1000;
  return jwt;
}

async function token(refresh = false): Promise<string> {
  if (!refresh && cachedJwt && Date.now() < jwtUntil) return cachedJwt;
  if (!loginInFlight) loginInFlight = login().finally(() => { loginInFlight = null; });
  return loginInFlight;
}

export async function get<T>(path: string, query: Record<string, string | number>): Promise<T> {
  const qs = new URLSearchParams(Object.entries(query).map(([key, value]) => [key, String(value)])).toString();
  const url = `${BASE}${path}${qs ? `?${qs}` : ""}`;
  let response = await request(url, { headers: { Authorization: `Bearer ${await token()}`, Accept: "application/json" } });
  if (response.status === 401) response = await request(url, {
    headers: { Authorization: `Bearer ${await token(true)}`, Accept: "application/json" },
  });
  if (!response.ok) throw statusError(response.status, false);
  try { return (await response.json()) as T; }
  catch { throw new CarApiError("Resposta da CarAPI não é JSON válido.", "response"); }
}
