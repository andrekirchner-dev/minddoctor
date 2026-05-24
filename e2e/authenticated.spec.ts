/**
 * Testes E2E autenticados — validam features reais do Axon com usuário logado.
 *
 * Pré-requisito: definir E2E_EMAIL e E2E_PASSWORD no ambiente.
 * Veja e2e/README.md para instruções completas.
 */
import { test, expect } from "@playwright/test";
import * as fs from "node:fs";
import * as path from "node:path";

// Pula todos os testes se o auth state não foi gerado (credenciais não configuradas)
const AUTH_FILE = path.join(__dirname, ".auth/user.json");
const authConfigured = (() => {
  try {
    const raw = JSON.parse(fs.readFileSync(AUTH_FILE, "utf-8"));
    return raw.origins?.length > 0 || raw.cookies?.some((c: { name: string }) => c.name === "axon_auth");
  } catch {
    return false;
  }
})();

test.beforeEach(async ({}, testInfo) => {
  if (!authConfigured) testInfo.skip(true, "E2E_EMAIL/E2E_PASSWORD não configurados — pulando teste autenticado.");
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
  test.beforeEach(async ({ page }) => {
    await page.goto("/consulta/historico");
    // Aguarda o fim do loading (skeleton desaparece)
    await expect(page.getByText("Histórico de Consultas")).toBeVisible({ timeout: 15_000 });
    await page.waitForFunction(
      () => !document.querySelector(".animate-pulse"),
      { timeout: 15_000 }
    );
  });

  test("chips de período estão presentes", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Tudo" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Hoje" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Semana" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Mês" })).toBeVisible();
  });

  test("chip 'Hoje' fica ativo ao clicar", async ({ page }) => {
    const btn = page.getByRole("button", { name: "Hoje" });
    await btn.click();
    await expect(btn).toHaveClass(/bg-primary/);
  });

  test("chip 'Tudo' volta ao estado ativo", async ({ page }) => {
    await page.getByRole("button", { name: "Hoje" }).click();
    const tudo = page.getByRole("button", { name: "Tudo" });
    await tudo.click();
    await expect(tudo).toHaveClass(/bg-primary/);
  });

  test("select de tipo existe com 'Todos os tipos'", async ({ page }) => {
    await expect(page.getByRole("combobox")).toBeVisible();
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
    await expect(page.getByRole("button", { name: "10" })).toBeVisible();
    await expect(page.getByRole("button", { name: "20" })).toBeVisible();
  });

  test("opções de tempo por questão estão disponíveis", async ({ page }) => {
    await page.getByRole("button", { name: /Simulado/ }).click();
    await expect(page.getByRole("button", { name: "60s" })).toBeVisible();
    await expect(page.getByRole("button", { name: "90s" })).toBeVisible();
    await expect(page.getByRole("button", { name: "120s" })).toBeVisible();
  });

  test("clicar 'Iniciar simulado' começa o simulado com timer e questão", async ({ page }) => {
    await page.getByRole("button", { name: /Simulado/ }).click();
    // Seleciona 10 questões, 60s
    await page.getByRole("button", { name: "10" }).click();
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
    await page.getByRole("button", { name: "10" }).click();
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
    await expect(page.getByText("Biblioteca Farmacológica")).toBeVisible({ timeout: 15_000 });
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
    await page.getByPlaceholder(/Buscar fármacos/).fill("sertralina");
    await expect(page.getByText(/resultado/i)).toBeVisible({ timeout: 3_000 });
    // Limpa clicando no X
    await page.getByRole("button", { name: "" }).last().click();
    // Seções originais voltam
    await expect(page.getByText("Receptores e Alvos")).toBeVisible();
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
  test("step 8 da nova consulta contém botão 'Salvar como Caso'", async ({ page }) => {
    await page.goto("/consulta/nova");
    await expect(page.getByText("Nova Consulta")).toBeVisible({ timeout: 15_000 });

    // Navega até o step 8 (pós-consulta) clicando em "Próximo" repetidamente
    // O botão "Próximo" avança um step por vez até o step 7 (depois o prontuário é gerado)
    // Simplificamos: pulamos direto para o step 8 via navegação nos steps

    // Avança pelos steps (Nova Consulta tem 9 steps, 0-8)
    for (let i = 0; i < 7; i++) {
      const next = page.getByRole("button", { name: /Próximo/ });
      if (await next.isVisible()) {
        await next.click();
        await page.waitForTimeout(300);
      }
    }

    // No step 7 (Prontuário), há o botão de confirmar prontuário
    // Clica em "Confirmar prontuário" ou avança
    const confirmar = page.getByRole("button", { name: /Confirmar prontuário/ });
    if (await confirmar.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await confirmar.click();
    } else {
      // Navega diretamente para step 8 via click no step indicator
      const proximoBtn = page.getByRole("button", { name: /Próximo/ });
      if (await proximoBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
        await proximoBtn.click();
      }
    }

    // Verifica se o botão "Salvar como Caso" está presente na tela pós-consulta
    // (pode estar em step 8 ou na tela de pos-consulta)
    await expect(page.getByText("Salvar como Caso Clínico")).toBeVisible({ timeout: 5_000 });
  });
});

// ── Navegação entre seções autenticadas ──────────────────────────────────────

test.describe("Navegação autenticada — rotas principais", () => {
  const rotas = [
    { path: "/dashboard",                   label: "Dashboard" },
    { path: "/consulta",                     label: /consulta/i },
    { path: "/consulta/historico",          label: "Histórico de Consultas" },
    { path: "/estudos",                      label: "Hub Acadêmico" },
    { path: "/estudos/questoes",             label: "Banco de Questões" },
    { path: "/estudos/analytics",            label: "Analytics de Aprendizagem" },
    { path: "/psicofarmacologia/biblioteca", label: /Biblioteca Farmacológica/i },
  ];

  for (const { path, label } of rotas) {
    test(`${path} carrega sem redirect`, async ({ page }) => {
      await page.goto(path);
      await expect(page).not.toHaveURL(/\/login/, { timeout: 10_000 });
      await expect(page.getByText(label).first()).toBeVisible({ timeout: 15_000 });
    });
  }
});
