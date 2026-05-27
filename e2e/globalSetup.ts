import { chromium } from "@playwright/test";
import * as fs from "node:fs";
import * as path from "node:path";

const API_KEY       = "AIzaSyDQK5BhXpr1OaCx6acQ1vYtuoHBbqUtihw";
const AUTH_DIR      = path.join(__dirname, ".auth");
const AUTH_FILE     = path.join(AUTH_DIR, "user.json");
const FB_AUTH_FILE  = path.join(AUTH_DIR, "firebase-auth.json");

// Firebase v12 uses IndexedDB (firebaseLocalStorageDb / firebaseLocalStorage)
// with fallback to localStorage (key: firebase:authUser:{apiKey}:[DEFAULT]).
// We inject into both so the SDK finds the user regardless of which it reads first.
export function makeAuthInitScript(authUser: object, apiKey: string): string {
  const fbaseKey   = `firebase:authUser:${apiKey}:[DEFAULT]`;
  const authJson   = JSON.stringify(authUser);
  const fbaseKeyJ  = JSON.stringify(fbaseKey);

  return `(function(){
  // ── 1. localStorage (Firebase fallback / v8-compat) ──────────────────────
  try { localStorage.setItem(${fbaseKeyJ}, ${JSON.stringify(authJson)}); } catch(_){}

  // ── 2. IndexedDB — firebaseLocalStorageDb / firebaseLocalStorage ──────────
  try {
    var req = indexedDB.open('firebaseLocalStorageDb', 1);
    req.onupgradeneeded = function(e){
      var db = e.target.result;
      if(!db.objectStoreNames.contains('firebaseLocalStorage'))
        db.createObjectStore('firebaseLocalStorage', {keyPath:'fbase_key'});
    };
    req.onsuccess = function(e){
      var db = e.target.result;
      try {
        db.transaction('firebaseLocalStorage','readwrite')
          .objectStore('firebaseLocalStorage')
          .put({fbase_key:${fbaseKeyJ}, value:${authJson}});
      } catch(_){}
    };
  } catch(_){}
})();`;
}

export default async function globalSetup() {
  const email    = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;
  const baseURL  = process.env.PLAYWRIGHT_BASE_URL ?? "https://axon-med.vercel.app";

  if (!fs.existsSync(AUTH_DIR)) fs.mkdirSync(AUTH_DIR, { recursive: true });

  if (!email || !password) {
    console.warn(
      "\n⚠️  E2E_EMAIL / E2E_PASSWORD não configurados.\n" +
      "   Testes autenticados serão pulados.\n" +
      "   Veja e2e/README.md para instruções de setup.\n"
    );
    fs.writeFileSync(AUTH_FILE, JSON.stringify({ cookies: [], origins: [] }));
    if (fs.existsSync(FB_AUTH_FILE)) fs.unlinkSync(FB_AUTH_FILE);
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

  const { idToken, refreshToken, localId, email: userEmail, displayName } =
    await res.json() as {
      idToken: string; refreshToken: string; localId: string;
      email: string; displayName?: string;
    };

  const authUser = {
    uid: localId,
    email: userEmail,
    emailVerified: false,
    displayName: displayName ?? "",
    isAnonymous: false,
    photoURL: null,
    phoneNumber: null,
    providerData: [{
      providerId: "password",
      uid: userEmail,
      email: userEmail,
      displayName: displayName ?? "",
      photoURL: null,
      phoneNumber: null,
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

  // ── 2. Salvar para testes injetarem no IDB/localStorage ──────────────────
  fs.writeFileSync(FB_AUTH_FILE, JSON.stringify(authUser));

  // ── 3. Abrir browser e injetar auth antes de qualquer JS do app ───────────
  const browser = await chromium.launch();
  const context = await browser.newContext({ baseURL });
  const page    = await context.newPage();

  // Registra o script para rodar em toda navegação (antes do Firebase SDK)
  await page.addInitScript(makeAuthInitScript(authUser, API_KEY));

  // Cookie necessário para o middleware (proxy.ts) liberar rotas protegidas
  const { hostname } = new URL(baseURL);
  await context.addCookies([{
    name: "axon_auth", value: "1",
    domain: hostname, path: "/",
    httpOnly: false,
    secure: baseURL.startsWith("https"),
    sameSite: "Lax",
  }]);

  // Vai para /login primeiro para que o domínio exista e o IDB seja criado
  await page.goto("/login");
  await page.waitForLoadState("networkidle");

  // Agora /dashboard: middleware passa (cookie setado acima),
  // Firebase lê do IDB/localStorage e autentica o usuário
  await page.goto("/dashboard");

  try {
    // Aguarda AuthProvider setar axon_auth=1 (prova que Firebase reconheceu o user)
    await page.waitForFunction(
      () => document.cookie.includes("axon_auth=1"),
      { timeout: 15_000 }
    );
    console.log(`\n✅ Auth E2E configurado para: ${userEmail}\n`);
  } catch {
    // Captura estado de debug antes de lançar erro
    const url     = page.url();
    const cookies = await context.cookies();
    const authCookie = cookies.find(c => c.name === "axon_auth");
    throw new Error(
      `globalSetup: Firebase não reconheceu o usuário via IDB/localStorage.\n` +
      `  URL atual: ${url}\n` +
      `  axon_auth cookie: ${authCookie?.value ?? "ausente"}\n` +
      `  Verifique se o usuário ${userEmail} existe no Firebase Console.`
    );
  }

  // ── 4. Salvar storageState (cookie + localStorage capturados) ─────────────
  await context.storageState({ path: AUTH_FILE });
  await browser.close();
}
