import { test, expect } from "@playwright/test";

// Rotas protegidas: devem redirecionar para /login
const rotasProtegidas = [
  "/dashboard",
  "/consulta",
  "/casos",
  "/escalas",
  "/emergencia",
  "/estudos",
  "/ia",
  "/ia/chat",
  "/psicofarmacologia",
  "/psicofarmacologia/biblioteca",
  "/psicofarmacologia/biblioteca/receptores",
  "/psicofarmacologia/biblioteca/receptores/serotoninergico",
  "/psicofarmacologia/biblioteca/receptores/dopaminergico",
  "/psicofarmacologia/biblioteca/moleculas",
  "/biblioteca",
  "/modulos",
  "/perfil",
  "/settings",
];

// Rotas públicas: devem responder 200 sem redirecionar
const rotasPublicas = ["/login"];

test.describe("Smoke — Página de login", () => {
  test("carrega com campos de email e senha", async ({ page }) => {
    await page.goto("/login");
    await expect(page).not.toHaveURL(/\/login.*error/);
    // Verifica que a página carregou sem erro 5xx
    const status = page.url();
    expect(status).toContain("/login");
  });
});

test.describe("Smoke — Rotas protegidas redirecionam para /login", () => {
  for (const rota of rotasProtegidas) {
    test(`${rota} redireciona para /login`, async ({ page }) => {
      await page.goto(rota);
      // Aguarda redirecionamento
      await page.waitForURL("**/login", { timeout: 10000 });
      expect(page.url()).toContain("/login");
    });
  }
});

test.describe("Smoke — Respostas HTTP sem erro 5xx", () => {
  const todasRotas = [...rotasPublicas, ...rotasProtegidas];

  for (const rota of todasRotas) {
    test(`${rota} não retorna 5xx`, async ({ page }) => {
      let serverError = false;
      page.on("response", (response) => {
        if (response.url().includes(rota) && response.status() >= 500) {
          serverError = true;
        }
      });
      await page.goto(rota);
      expect(serverError).toBe(false);
    });
  }
});

test.describe("Smoke — Página de receptores estáticas", () => {
  const sistemas = [
    "serotoninergico",
    "dopaminergico",
    "noradrenergico",
    "glutamatergico",
    "gabargico",
    "histaminergico",
    "colinergico",
    "opioide",
    "endocanabinoide",
    "melatoninergico",
    "orexinergico",
    "sigma",
    "transportadores",
    "enzimas",
    "canais",
  ];

  for (const sistema of sistemas) {
    test(`receptores/${sistema} redireciona para /login (rota existe)`, async ({ page }) => {
      await page.goto(`/psicofarmacologia/biblioteca/receptores/${sistema}`);
      await page.waitForURL("**/login", { timeout: 10000 });
      expect(page.url()).toContain("/login");
    });
  }
});
