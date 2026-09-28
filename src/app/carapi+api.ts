const ALLOWED_RESOURCES = new Set(["trims", "engines", "mileages", "bodies"]);

const ALLOWED_PARAMS = new Set([
  "make",
  "model",
  "year",
  "trim_id",
  "page",
  "limit",
]);

let cachedJwt = "";
let jwtUntil = 0;
let loginPending: Promise<string> | null = null;

function error(message: string, status: number) {
  return Response.json({ message }, { status });
}

async function login() {
  const api_token = process.env.EXPO_PUBLIC_CARAPI_TOKEN;
  const api_secret = process.env.EXPO_PUBLIC_CARAPI_SECRET;
  if (!api_token || !api_secret) {
    throw Object.assign(new Error("Credenciais da CarAPI ausentes no .env.local."), { status: 500 });
  }

  const response = await fetch("https://carapi.app/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "text/plain" },
    body: JSON.stringify({ api_token, api_secret }),
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw Object.assign(new Error("A CarAPI rejeitou as credenciais."), { status: response.status });

  const jwt = (await response.text()).trim().replace(/^"|"$/g, "");
  if (jwt.split(".").length !== 3) {
    throw Object.assign(new Error("A CarAPI não retornou um JWT válido."), { status: 502 });
  }
  cachedJwt = jwt;
  jwtUntil = Date.now() + 6 * 24 * 60 * 60 * 1000;
  return jwt;
}

async function token(refresh = false) {
  if (!refresh && cachedJwt && Date.now() < jwtUntil) return cachedJwt;
  if (!loginPending) loginPending = login().finally(() => { loginPending = null; });
  return loginPending;
}

async function upstream(url: string) {
  let response = await fetch(url, {
    headers: { Authorization: `Bearer ${await token()}`, Accept: "application/json" },
    signal: AbortSignal.timeout(20000),
  });
  if (response.status === 401) {
    response = await fetch(url, {
      headers: { Authorization: `Bearer ${await token(true)}`, Accept: "application/json" },
      signal: AbortSignal.timeout(20000),
    });
  }
  return response;
}

export async function GET(request: Request) {
  const incoming = new URL(request.url);
  const resource = incoming.searchParams.get("resource") ?? "";
  if (!ALLOWED_RESOURCES.has(resource)) return error("Consulta da CarAPI inválida.", 400);

  incoming.searchParams.delete("resource");

  for (const key of incoming.searchParams.keys()) {
  if (!ALLOWED_PARAMS.has(key)) {
  console.warn(JSON.stringify({
    event: "security_input_rejected",
    parameter: key,
    status: 400,
    timestamp: new Date().toISOString(),
  }));

  return error(`Parâmetro não permitido: ${key}.`, 400);
  }
}

  const url = `https://carapi.app/api/${resource}/v2?${incoming.searchParams.toString()}`;
  try {
    const response = await upstream(url);
    if (!response.ok) {
      const message = response.status === 401 ? "Credenciais rejeitadas pela CarAPI (401)." :
        response.status === 403 ? "Acesso bloqueado pela CarAPI (403)." :
        response.status === 429 ? "Limite da CarAPI atingido (429)." :
        `CarAPI respondeu HTTP ${response.status}.`;
      console.warn(JSON.stringify({
        event: "carapi_request_failed",
        resource,
        status: response.status,
        timestamp: new Date().toISOString(),
  }));
      return error(message, response.status);
    }
    return new Response(await response.text(), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (caught) {
    const status = Number((caught as { status?: number })?.status) || 502;
    const message = caught instanceof Error ? caught.message : "Não foi possível consultar a CarAPI.";
    return error(message, status);
  }
}
