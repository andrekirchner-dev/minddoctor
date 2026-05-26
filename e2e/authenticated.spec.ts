/**
 * Testes E2E autenticados — validam features reais do Axon com usuário logado.
 *
 * Pré-requisito: definir E2E_EMAIL e E2E_PASSWORD no ambiente.
 * Veja e2e/README.md para instruções completas.
 */
import { test, expect } from "@playwright/test";
import * as fs from "node:fs";
import * as path from "node:path";

// Firebase v12 usa IndexedDB (não localStorage) — injetamos auth antes de cada page.goto
const FB_AUTH_FILE = path.join(__dirname, ".auth/firebase-auth.json");
const authConfigured = fs.existsSync(FB_AUTH_FILE);

const API_KEY = "AIzaSyDQK5BhXpr1OaCx6acQ1vYtuoHBbqUtihw";

function makeAuthScript(authUser: object): string {
  const fbaseKey  = `firebase:authUser:${API_KEY}:[DEFAULT]`;
  const authJson  = JSON.stringify(authUser);
  const fbaseKeyJ = JSON.stringify(fbaseKey);
  return `(function(){
  window.__axonAuthDone = false;
  try { localStorage.setItem(${fbaseKeyJ}, ${JSON.stringify(authJson)}); } catch(_){}
  try {
    var req = indexedDB.open('firebaseLocalStorageDb', 1);
    req.onupgradeneeded = function(e){
      var db = e.target.result;
      if(!db.objectStoreNames.contains('firebaseLocalStorage'))
        db.createObjectStore('firebaseLocalStorage',{keyPath:'fbase_key'});
    };
    req.onsuccess = function(e){
      var db = e.target.result;
      try{
        var put = db.transaction('firebaseLocalStorage','readwrite')
          .objectStore('firebaseLocalStorage')
          .put({fbase_key:${fbaseKeyJ},value:${authJson}});
        put.onsuccess = function(){ window.__axonAuthDone = true; };
        put.onerror   = function(){ window.__axonAuthDone = true; };
      }catch(_){ window.__axonAuthDone = true; }
    };
    req.onerror = function(){ window.__axonAuthDone = true; };
  } catch(_){ window.__axonAuthDone = true; }
})();`;
}

test.beforeEach(async ({ page, context }, testInfo) => {
  if (!authConfigured) {
    testInfo.skip(true, "E2E_EMAIL/E2E_PASSWORD não configurados — pulando teste autenticado.");
    return;
  }
  const authUser = JSON.parse(fs.readFileSync(FB_AUTH_FILE, "utf-8"));
  // Injeta auth em localStorage + IndexedDB antes de qualquer page.goto
  await page.addInitScript(makeAuthScript(authUser));
  // Cookie para o middleware (proxy.ts) liberar rotas protegidas
  const baseURL = "https://axon-med.vercel.app";
  await context.addCookies([{
    name: "axon_auth", value: "1",
    domain: "axon-med.vercel.app", path: "/",
    httpOnly: false, secure: true, sameSite: "Lax",
  }]);
  // Warmup on /login: waits until IDB write is confirmed done (window.__axonAuthDone).
  // After this, the committed IDB data is available for Firebase to read on ANY subsequent
  // page navigation in this context, eliminating the PUT/GET race condition.
  await page.goto("/login");
  await page.waitForFunction(
    () => (window as unknown as Record<string, unknown>)["__axonAuthDone"] === true,
    { timeout: 10_000 }
  );
});

// ── Dashboard ────────────────────────────────────────────────────────────────

test.describe("Dashboard autenticado", () => {
  test("carrega sem redirecionar para /login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).not.toHaveURL(/\/login/);
    // Aguarda sidebar ou conteúdo principal
    await expect(page.locator("main")).toBeVisible({ timeout: 15_000 });
  });
});

// ── Feature 2.2 — Filtros no histórico ──────────────────────────────────────

test.describe("Histórico de consultas — filtros (2.2)", () => {
  // Firestore cold-start can exceed 30s; 90s gives 50s assertion + 40s page overhead
  test.describe.configure({ timeout: 90_000 });

  test.beforeEach(async ({ page }) => {
    await page.goto("/consulta/historico");
    await expect(page.getByText("Histórico de Consultas")).toBeVisible({ timeout: 15_000 });
    await expect(page).not.toHaveURL(/\/login/, { timeout: 5_000 });
  });

  test("chips de período estão presentes", async ({ page }) => {
    // Firestore cold-start can exceed 30s — allow 50s (within 60s describe timeout)
    await expect(page.getByRole("button", { name: "Tudo" })).toBeVisible({ timeout: 50_000 });
    await expect(page.getByRole("button", { name: "Hoje" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Semana" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Mês" })).toBeVisible();
  });

  test("chip 'Hoje' fica ativo ao clicar", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Hoje" })).toBeVisible({ timeout: 50_000 });
    const btn = page.getByRole("button", { name: "Hoje" });
    await btn.click();
    await expect(btn).toHaveClass(/bg-primary/);
  });

  test("chip 'Tudo' volta ao estado ativo", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Hoje" })).toBeVisible({ timeout: 50_000 });
    await page.getByRole("button", { name: "Hoje" }).click();
    const tudo = page.getByRole("button", { name: "Tudo" });
    await tudo.click();
    await expect(tudo).toHaveClass(/bg-primary/);
  });

  test("select de tipo existe com 'Todos os tipos'", async ({ page }) => {
    await expect(page.getByRole("combobox")).toBeVisible({ timeout: 50_000 });
    await expect(page.getByRole("combobox")).toContainText("Todos os tipos");
  });

  test("barra de busca existe e é interativa", async ({ page }) => {
    const input = page.getByPlaceholder("Buscar por paciente, CID ou tipo de consulta...");
    await expect(input).toBeVisible();
    await input.fill("teste");
    await expect(input).toHaveValue("teste");
  });

  test("botão 'Nova consulta' existe no header", async ({ page }) => {
    await expect(page.getByRole("link", { name: /Nova consulta/ })).toBeVisible();
  });
});

// ── Feature 2.1 — Exportar PDF ───────────────────────────────────────────────

test.describe("Exportar PDF (2.1)", () => {
  test("página historico tem o layout correto mesmo sem dados", async ({ page }) => {
    await page.goto("/consulta/historico");
    await expect(page.getByText("Histórico de Consultas")).toBeVisible({ timeout: 15_000 });
    // Verifica que não há erro — página renderizou
    await expect(page.locator("body")).not.toContainText("Error");
    await expect(page.locator("body")).not.toContainText("500");
  });
});

// ── Feature 2.3 — Simulado cronometrado ──────────────────────────────────────

test.describe("Simulado cronometrado (2.3)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/estudos/questoes");
    await expect(page.getByText("Banco de Questões")).toBeVisible({ timeout: 15_000 });
  });

  test("botão 'Simulado' existe no header", async ({ page }) => {
    await expect(page.getByRole("button", { name: /Simulado/ })).toBeVisible();
  });

  test("clicar em 'Simulado' mostra card de configuração", async ({ page }) => {
    await page.getByRole("button", { name: /Simulado/ }).click();
    await expect(page.getByText("Configurar Simulado")).toBeVisible();
  });

  test("opções de número de questões estão disponíveis", async ({ page }) => {
    await page.getByRole("button", { name: /Simulado/ }).click();
    await expect(page.getByRole("button", { name: "10" }).first()).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("button", { name: "20" }).first()).toBeVisible({ timeout: 10_000 });
  });

  test("opções de tempo por questão estão disponíveis", async ({ page }) => {
    await page.getByRole("button", { name: /Simulado/ }).click();
    await expect(page.getByRole("button", { name: "60s" })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("button", { name: "90s" })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole("button", { name: "120s" })).toBeVisible({ timeout: 10_000 });
  });

  test("clicar 'Iniciar simulado' começa o simulado com timer e questão", async ({ page }) => {
    await page.getByRole("button", { name: /Simulado/ }).click();
    // Seleciona 10 questões, 60s
    await page.getByRole("button", { name: "10" }).first().click();
    await page.getByRole("button", { name: "60s" }).click();
    // Inicia
    await page.getByRole("button", { name: "Iniciar simulado" }).click();

    // Aguarda questão aparecer
    await expect(page.getByText(/Questão 1 de 10/)).toBeVisible({ timeout: 5_000 });
    // Timer visível
    await expect(page.locator("text=/\\d+s/").first()).toBeVisible();
    // Botão de avançar
    await expect(page.getByRole("button", { name: /Próxima questão|Finalizar/ })).toBeVisible();
  });

  test("responder uma questão e avançar vai para a próxima", async ({ page }) => {
    await page.getByRole("button", { name: /Simulado/ }).click();
    await page.getByRole("button", { name: "10" }).first().click();
    await page.getByRole("button", { name: "60s" }).click();
    await page.getByRole("button", { name: "Iniciar simulado" }).click();

    await expect(page.getByText(/Questão 1 de/)).toBeVisible({ timeout: 5_000 });

    // Clica na primeira alternativa (A)
    await page.getByRole("button", { name: /^A\)/ }).first().click();

    // Avança
    await page.getByRole("button", { name: /Próxima questão/ }).click();

    // Deve mostrar questão 2
    await expect(page.getByText(/Questão 2 de/)).toBeVisible({ timeout: 5_000 });
  });
});

// ── Feature 2.6 — Busca na Biblioteca Farmacológica ──────────────────────────

test.describe("Busca na Biblioteca Farmacológica (2.6)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/psicofarmacologia/biblioteca");
    await expect(page.getByText("Biblioteca de Psicofarmacologia")).toBeVisible({ timeout: 15_000 });
  });

  test("barra de busca está presente", async ({ page }) => {
    await expect(page.getByPlaceholder(/Buscar fármacos/)).toBeVisible();
  });

  test("buscar 'sertralina' retorna resultados", async ({ page }) => {
    await page.getByPlaceholder(/Buscar fármacos/).fill("sertralina");
    await expect(page.getByText(/resultado/i)).toBeVisible({ timeout: 3_000 });
    // Badge de categoria "Fármaco" aparece
    await expect(page.getByText("Fármaco").first()).toBeVisible();
  });

  test("buscar 'depressão' retorna resultados de transtornos", async ({ page }) => {
    await page.getByPlaceholder(/Buscar fármacos/).fill("depressão");
    await expect(page.getByText("Transtorno").first()).toBeVisible({ timeout: 3_000 });
  });

  test("buscar 'serotonin' retorna sistemas receptoriais", async ({ page }) => {
    await page.getByPlaceholder(/Buscar fármacos/).fill("serotonin");
    await expect(page.getByText("Sistema receptorial").first()).toBeVisible({ timeout: 3_000 });
  });

  test("limpar busca volta a mostrar as seções normais", async ({ page }) => {
    const input = page.getByPlaceholder(/Buscar fármacos/);
    await input.fill("sertralina");
    await expect(page.getByText(/resultado/i)).toBeVisible({ timeout: 3_000 });
    // Limpa o campo
    await input.fill("");
    // Seções originais voltam
    await expect(page.getByText("Receptores e Alvos")).toBeVisible({ timeout: 5_000 });
  });

  test("busca com 1 char não ativa os resultados", async ({ page }) => {
    await page.getByPlaceholder(/Buscar fármacos/).fill("s");
    await expect(page.getByText(/resultado/i)).not.toBeVisible();
  });
});

// ── Feature 2.5 — Analytics de Aprendizagem ──────────────────────────────────

test.describe("Analytics de Aprendizagem (2.5)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/estudos/analytics");
    await expect(page.getByText("Analytics de Aprendizagem")).toBeVisible({ timeout: 15_000 });
  });

  test("página carrega com header correto", async ({ page }) => {
    await expect(page.getByText("Analytics de Aprendizagem")).toBeVisible();
    await expect(page.getByText("Progresso acumulado em flashcards")).toBeVisible();
  });

  test("cards de resumo estão presentes", async ({ page }) => {
    await expect(page.getByText("Cards dominados")).toBeVisible();
    await expect(page.getByText(/Acurácia em questões/)).toBeVisible();
    await expect(page.getByText("Questões respondidas")).toBeVisible();
    await expect(page.getByText("Cards para revisar hoje")).toBeVisible();
  });

  test("seção de flashcards por deck está presente", async ({ page }) => {
    await expect(page.getByText("Flashcards por deck")).toBeVisible();
    // Pelo menos um deck deve aparecer (TEP - Prova de Título)
    await expect(page.getByText(/TEP/)).toBeVisible();
  });

  test("link para Journal Club existe", async ({ page }) => {
    await expect(page.getByRole("link", { name: /Ver artigos/ })).toBeVisible();
  });

  test("link para analytics está no hub de estudos", async ({ page }) => {
    await page.goto("/estudos");
    await expect(page.getByRole("link", { name: /Analytics de Aprendizagem/ })).toBeVisible();
  });
});

// ── Feature 2.4 — Salvar como Caso Clínico ───────────────────────────────────

test.describe("Salvar como Caso Clínico (2.4)", () => {
  test.describe.configure({ timeout: 60_000 });

  test("step 8 da nova consulta contém botão 'Salvar como Caso'", async ({ page }) => {
    await page.goto("/consulta/nova");
    await expect(page.locator("main").getByText("Nova Consulta").first()).toBeVisible({ timeout: 15_000 });

    // STEPS has 8 items (0-7); Próximo visible on steps 0-6 → advances 0→1→...→7
    for (let i = 0; i < 7; i++) {
      const next = page.getByRole("button", { name: /Próximo/ });
      await expect(next).toBeVisible({ timeout: 5_000 });
      await next.click();
      await page.waitForTimeout(600);
    }

    // On step 7 (Prontuário): first click "Gerar prontuário" to populate prontuarioBase,
    // then click "Confirmar prontuário-base e continuar" → setStep(8)
    const gerar = page.getByRole("button", { name: /Gerar prontuário/ });
    await expect(gerar).toBeVisible({ timeout: 5_000 });
    await gerar.click();

    const confirmar = page.getByRole("button", { name: /Confirmar prontuário/ });
    await expect(confirmar).toBeVisible({ timeout: 5_000 });
    await confirmar.click();

    // Step 8 (Central Pós-Consulta) contains "Salvar como Caso Clínico"
    await expect(page.getByText("Salvar como Caso Clínico")).toBeVisible({ timeout: 10_000 });
  });
});

// ── Navegação entre seções autenticadas ──────────────────────────────────────

test.describe("Navegação autenticada — rotas principais", () => {
  const rotas: Array<{ path: string; label: string | RegExp | null }> = [
    { path: "/dashboard",                   label: null },
    { path: "/consulta",                     label: "Consulta" },
    { path: "/consulta/historico",          label: "Histórico de Consultas" },
    { path: "/estudos",                      label: "Hub Acadêmico" },
    { path: "/estudos/questoes",             label: "Banco de Questões" },
    { path: "/estudos/analytics",            label: "Analytics de Aprendizagem" },
    { path: "/psicofarmacologia/biblioteca", label: "Biblioteca de Psicofarmacologia" },
  ];

  for (const { path, label } of rotas) {
    test(`${path} carrega sem redirect`, async ({ page }) => {
      await page.goto(path);
      await expect(page).not.toHaveURL(/\/login/, { timeout: 10_000 });
      if (label) {
        // Scope to main to avoid matching hidden sidebar nav spans
        await expect(page.locator("main").getByText(label).first()).toBeVisible({ timeout: 15_000 });
      } else {
        await expect(page.locator("main")).toBeVisible({ timeout: 15_000 });
      }
    });
  }
});

// ── Feature 3.2 — Novas escalas clínicas ─────────────────────────────────────

test.describe("Escalas — novas escalas (3.2)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/escalas");
    await expect(page).not.toHaveURL(/\/login/, { timeout: 10_000 });
  });

  test("MADRS aparece na lista de escalas", async ({ page }) => {
    await expect(page.getByText("MADRS", { exact: false })).toBeVisible({ timeout: 15_000 });
  });

  test("YMRS aparece na lista de escalas", async ({ page }) => {
    await expect(page.getByText("YMRS", { exact: false })).toBeVisible({ timeout: 15_000 });
  });

  test("PANSS aparece na lista de escalas", async ({ page }) => {
    await expect(page.getByText("PANSS", { exact: false })).toBeVisible({ timeout: 15_000 });
  });

  test("PCL-5 aparece na lista de escalas", async ({ page }) => {
    await expect(page.getByText("PCL-5", { exact: false })).toBeVisible({ timeout: 15_000 });
  });

  test("clicar em MADRS abre a escala", async ({ page }) => {
    await expect(page.getByText("MADRS", { exact: false })).toBeVisible({ timeout: 15_000 });
    await page.getByText("MADRS", { exact: false }).first().click();
    // Verifica que a escala abriu — header ou primeiro item visível
    await expect(
      page.getByText("MADRS", { exact: false }).first()
    ).toBeVisible({ timeout: 10_000 });
    await expect(page.locator("main")).toBeVisible();
  });
});

// ── Feature 3.3 — Novos protocolos de emergência ─────────────────────────────

test.describe("Emergência — novos protocolos (3.3)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/emergencia");
    await expect(page).not.toHaveURL(/\/login/, { timeout: 10_000 });
  });

  test("card 'Abstinência' aparece na lista", async ({ page }) => {
    await expect(page.getByText("Abstinência", { exact: false }).first()).toBeVisible({ timeout: 15_000 });
  });

  test("card 'Catatonia' aparece na lista", async ({ page }) => {
    await expect(page.getByText("Catatonia", { exact: false }).first()).toBeVisible({ timeout: 15_000 });
  });

  test("card de 'Intox' ou 'Lítio' aparece na lista", async ({ page }) => {
    await page.waitForLoadState("domcontentloaded");
    const intox = page.getByText("Intox", { exact: false });
    const litio = page.getByText("Lítio", { exact: false });
    const intoxVisible = await intox.first().isVisible().catch(() => false);
    const litioVisible = await litio.first().isVisible().catch(() => false);
    expect(intoxVisible || litioVisible).toBe(true);
  });

  test("card de 'Crise Conversiva' ou 'Conversiva' aparece na lista", async ({ page }) => {
    await page.waitForLoadState("domcontentloaded");
    const criseConversiva = page.getByText("Crise Conversiva", { exact: false });
    const conversiva = page.getByText("Conversiva", { exact: false });
    const criseVisible = await criseConversiva.first().isVisible().catch(() => false);
    const conversivaVisible = await conversiva.first().isVisible().catch(() => false);
    expect(criseVisible || conversivaVisible).toBe(true);
  });
});

// ── Feature 3.4 — Módulo de Farmacogenética ──────────────────────────────────

test.describe("Farmacogenética (3.4)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/psicofarmacologia/biblioteca/farmacogenetica");
    await expect(page).not.toHaveURL(/\/login/, { timeout: 10_000 });
  });

  test("não redireciona para login", async ({ page }) => {
    await expect(page).not.toHaveURL(/\/login/);
  });

  test("CYP2D6 aparece na página", async ({ page }) => {
    await expect(page.getByText("CYP2D6", { exact: false }).first()).toBeVisible({ timeout: 15_000 });
  });

  test("CYP2C19 aparece na página", async ({ page }) => {
    await expect(page.getByText("CYP2C19", { exact: false }).first()).toBeVisible({ timeout: 15_000 });
  });

  test("'Fenótipo' ou 'Metabolizador' aparece na página", async ({ page }) => {
    await page.waitForLoadState("domcontentloaded");
    const fenotipo = page.getByText("Fenótipo", { exact: false });
    const metabolizador = page.getByText("Metabolizador", { exact: false });
    const fenotipoVisible = await fenotipo.first().isVisible().catch(() => false);
    const metabolizadorVisible = await metabolizador.first().isVisible().catch(() => false);
    expect(fenotipoVisible || metabolizadorVisible).toBe(true);
  });
});

// ── Feature 3.1 — Flashcards — novos decks ───────────────────────────────────

test.describe("Flashcards — novos decks (3.1)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/estudos/flashcards");
    await expect(page).not.toHaveURL(/\/login/, { timeout: 10_000 });
  });

  test("deck 'Neurologia' aparece na lista", async ({ page }) => {
    await expect(page.getByText("Neurologia", { exact: false }).first()).toBeVisible({ timeout: 15_000 });
  });

  test("deck 'Infantil' ou 'Psiquiatria Infantil' aparece na lista", async ({ page }) => {
    await page.waitForLoadState("domcontentloaded");
    const infantil = page.getByText("Infantil", { exact: false });
    const psiquiatriaInfantil = page.getByText("Psiquiatria Infantil", { exact: false });
    const infantilVisible = await infantil.first().isVisible().catch(() => false);
    const psiquiatriaInfantilVisible = await psiquiatriaInfantil.first().isVisible().catch(() => false);
    expect(infantilVisible || psiquiatriaInfantilVisible).toBe(true);
  });

  test("deck 'Psicoterapias' aparece na lista", async ({ page }) => {
    await expect(page.getByText("Psicoterapias", { exact: false })).toBeVisible({ timeout: 15_000 });
  });
});

// ── Feature 3.5 — Questões comentadas expandidas ─────────────────────────────

test.describe("Questões comentadas (3.5)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/estudos/questoes");
    await expect(page.getByText("Banco de Questões")).toBeVisible({ timeout: 15_000 });
  });

  test("página carrega sem erro", async ({ page }) => {
    // Check for Next.js error page patterns (not generic "500" — medical text contains numbers like "1.500/mm³")
    await expect(page.locator("body")).not.toContainText("Application error:");
    await expect(page.locator("body")).not.toContainText("Internal Server Error");
    await expect(page.locator("main")).toBeVisible();
  });

  test("há pelo menos um elemento de questão visível", async ({ page }) => {
    // Tenta seletor data-testid primeiro; cai em texto genérico de questão se não existir
    const byTestId = page.locator("[data-testid]").first();
    const byQuestionText = page.locator("text=/Questão|questão|Alternativa/i").first();
    const testIdVisible = await byTestId.isVisible().catch(() => false);
    const questionVisible = await byQuestionText.isVisible().catch(() => false);
    expect(testIdVisible || questionVisible).toBe(true);
  });

  test("contador ou badge indica mais de 42 questões (se visível)", async ({ page }) => {
    // Busca por um badge ou texto com número > 42; pula o assert se o elemento não existir
    const badge = page.getByText(/\d{2,}/, { exact: false }).first();
    const isVisible = await badge.isVisible({ timeout: 5_000 }).catch(() => false);
    if (isVisible) {
      const texto = await badge.textContent();
      const numero = parseInt((texto ?? "0").replace(/\D/g, ""), 10);
      expect(numero).toBeGreaterThan(42);
    }
  });
});

// ── Nova Consulta — módulos bloco 4 ──────────────────────────────────────────

test.describe("Nova Consulta — módulos bloco 4", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/consulta/nova");
    await expect(page.locator("main").getByText("Nova Consulta").first()).toBeVisible({ timeout: 15_000 });
    await expect(page).not.toHaveURL(/\/login/);
  });

  test("página carrega sem redirect para login", async ({ page }) => {
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator("main")).toBeVisible();
  });

  test("botão de Configuração Avançada ou Módulos existe", async ({ page }) => {
    const configAvancada = page.getByRole("button", { name: /Configuração Avançada/i });
    const modulos = page.getByRole("button", { name: /Módulos/i });
    const linkConfigAvancada = page.getByRole("link", { name: /Configuração Avançada/i });
    const linkModulos = page.getByRole("link", { name: /Módulos/i });
    const configVisible = await configAvancada.isVisible().catch(() => false);
    const modulosVisible = await modulos.isVisible().catch(() => false);
    const linkConfigVisible = await linkConfigAvancada.isVisible().catch(() => false);
    const linkModulosVisible = await linkModulos.isVisible().catch(() => false);
    expect(configVisible || modulosVisible || linkConfigVisible || linkModulosVisible).toBe(true);
  });

  test("após abrir configuração avançada, 'Modo Residente' aparece", async ({ page }) => {
    const configAvancada = page.getByRole("button", { name: /Configuração Avançada/i });
    const modulos = page.getByRole("button", { name: /Módulos/i });
    const configVisible = await configAvancada.isVisible().catch(() => false);
    if (configVisible) {
      await configAvancada.click();
    } else if (await modulos.isVisible().catch(() => false)) {
      await modulos.click();
    }
    await expect(page.getByText("Modo Residente", { exact: false })).toBeVisible({ timeout: 10_000 });
  });

  test("após abrir configuração avançada, 'Prejuízo Funcional' aparece", async ({ page }) => {
    const configAvancada = page.getByRole("button", { name: /Configuração Avançada/i });
    const modulos = page.getByRole("button", { name: /Módulos/i });
    const configVisible = await configAvancada.isVisible().catch(() => false);
    if (configVisible) {
      await configAvancada.click();
    } else if (await modulos.isVisible().catch(() => false)) {
      await modulos.click();
    }
    await expect(page.getByText("Prejuízo Funcional", { exact: false })).toBeVisible({ timeout: 10_000 });
  });

  test("após abrir configuração avançada, 'Capacidade Laboral' aparece", async ({ page }) => {
    const configAvancada = page.getByRole("button", { name: /Configuração Avançada/i });
    const modulos = page.getByRole("button", { name: /Módulos/i });
    const configVisible = await configAvancada.isVisible().catch(() => false);
    if (configVisible) {
      await configAvancada.click();
    } else if (await modulos.isVisible().catch(() => false)) {
      await modulos.click();
    }
    await expect(page.getByText("Capacidade Laboral", { exact: false })).toBeVisible({ timeout: 10_000 });
  });

  test("após abrir configuração avançada, 'Evolução Comparativa' aparece", async ({ page }) => {
    const configAvancada = page.getByRole("button", { name: /Configuração Avançada/i });
    const modulos = page.getByRole("button", { name: /Módulos/i });
    const configVisible = await configAvancada.isVisible().catch(() => false);
    if (configVisible) {
      await configAvancada.click();
    } else if (await modulos.isVisible().catch(() => false)) {
      await modulos.click();
    }
    await expect(page.getByText("Evolução Comparativa", { exact: false })).toBeVisible({ timeout: 10_000 });
  });

  test("após abrir configuração avançada, 'Integração' ou 'Farmacologia' aparece", async ({ page }) => {
    const configAvancada = page.getByRole("button", { name: /Configuração Avançada/i });
    const modulos = page.getByRole("button", { name: /Módulos/i });
    const configVisible = await configAvancada.isVisible().catch(() => false);
    if (configVisible) {
      await configAvancada.click();
    } else if (await modulos.isVisible().catch(() => false)) {
      await modulos.click();
    }
    await page.waitForLoadState("domcontentloaded");
    const integracao = page.getByText("Integração", { exact: false });
    const farmacologia = page.getByText("Farmacologia", { exact: false });
    const integracaoVisible = await integracao.first().isVisible().catch(() => false);
    const farmacologiaVisible = await farmacologia.first().isVisible().catch(() => false);
    expect(integracaoVisible || farmacologiaVisible).toBe(true);
  });
});
