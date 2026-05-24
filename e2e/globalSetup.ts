import { chromium } from "@playwright/test";
import * as fs from "node:fs";
import * as path from "node:path";

const API_KEY  = "AIzaSyDQK5BhXpr1OaCx6acQ1vYtuoHBbqUtihw";
const AUTH_DIR = path.join(__dirname, ".auth");
const AUTH_FILE = path.join(AUTH_DIR, "user.json");

export default async function globalSetup() {
  const email    = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;
  const baseURL  = process.env.PLAYWRIGHT_BASE_URL ?? "https://axon-med.vercel.app";

  // Ensure .auth dir exists
  if (!fs.existsSync(AUTH_DIR)) fs.mkdirSync(AUTH_DIR, { recursive: true });

  if (!email || !password) {
    console.warn(
      "\n⚠️  E2E_EMAIL / E2E_PASSWORD não configurados.\n" +
      "   Testes autenticados serão pulados.\n" +
      "   Veja e2e/README.md para instruções de setup.\n"
    );
    // Write empty state so the project doesn't crash
    fs.writeFileSync(AUTH_FILE, JSON.stringify({ cookies: [], origins: [] }));
    return;
  }

  // ── 1. Autenticar via Firebase REST API ──────────────────────────────────
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Firebase auth falhou (${res.status}): ${body}`);
  }

  const { idToken, refreshToken, localId, email: userEmail, displayName } = await res.json() as {
    idToken: string; refreshToken: string; localId: string;
    email: string; displayName?: string;
  };

  // ── 2. Construir objeto de auth do Firebase (formato localStorage) ───────
  // Firebase Auth JS SDK armazena auth state em localStorage sob esta chave.
  const FIREBASE_AUTH_KEY = `firebase:authUser:${API_KEY}:[DEFAULT]`;
  const authUser = {
    uid: localId,
    email: userEmail,
    displayName: displayName ?? "",
    isAnonymous: false,
    photoURL: null,
    providerData: [{
      providerId: "password",
      uid: userEmail,
      email: userEmail,
      displayName: displayName ?? "",
      photoURL: null,
    }],
    stsTokenManager: {
      refreshToken,
      accessToken: idToken,
      expirationTime: Date.now() + 3_600_000,
    },
    lastLoginAt: String(Date.now()),
    createdAt: String(Date.now()),
    apiKey: API_KEY,
    appName: "[DEFAULT]",
  };

  // ── 3. Abrir browser, injetar estado e salvar storageState ───────────────
  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();

  // Navega para /login apenas para que o domínio seja definido (localStorage é por origem)
  await page.goto("/login");
  await page.waitForLoadState("networkidle");

  // Injeta auth state no localStorage (Firebase Auth JS SDK lê de lá no browser)
  await page.evaluate(
    ({ key, value }: { key: string; value: string }) => localStorage.setItem(key, value),
    { key: FIREBASE_AUTH_KEY, value: JSON.stringify(authUser) }
  );

  // Seta o cookie de auth (AuthGuard usa ele para render otimista)
  const { hostname } = new URL(baseURL);
  await context.addCookies([{
    name: "axon_auth", value: "1",
    domain: hostname, path: "/",
    httpOnly: false, secure: baseURL.startsWith("https"),
    sameSite: "Lax",
  }]);

  // ── 4. Confirmar que o login funciona ─────────────────────────────────────
  await page.goto("/dashboard");
  try {
    await page.waitForURL("**/dashboard", { timeout: 12_000 });
    console.log(`\n✅ Auth E2E configurado para: ${userEmail}\n`);
  } catch {
    throw new Error(
      "globalSetup: redirect para /dashboard falhou. " +
      "Verifique se o usuário existe no Firebase e se a senha está correta."
    );
  }

  // ── 5. Salvar storageState (inclui localStorage + cookies) ───────────────
  await context.storageState({ path: AUTH_FILE });
  await browser.close();
}
