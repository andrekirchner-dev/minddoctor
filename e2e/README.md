# E2E Tests — Axon

## Smoke tests (sem autenticação)

Verificam que rotas respondem sem erro 5xx e redirecionam para `/login`:

```bash
npx playwright test --project=smoke
```

## Testes autenticados

Validam features reais com usuário logado. Requerem setup único:

### 1. Criar usuário de teste no Firebase Console

1. Acesse [Firebase Console](https://console.firebase.google.com) → projeto `minddoctor-dbcc9`
2. Ir em **Authentication → Sign-in method**
3. Habilitar **Email/Password**
4. Ir em **Authentication → Users → Add user**
5. Criar: `axon.e2e@gmail.com` / senha segura

### 2. Configurar variáveis de ambiente

Crie `.env.e2e.local` na raiz do projeto (já está no `.gitignore`):

```bash
E2E_EMAIL=axon.e2e@gmail.com
E2E_PASSWORD=SUA_SENHA_AQUI
```

### 3. Rodar os testes

```bash
# Exporta as vars e roda
source .env.e2e.local && npx playwright test --project=authenticated

# Ou inline:
E2E_EMAIL=axon.e2e@gmail.com E2E_PASSWORD=senha npx playwright test --project=authenticated
```

### Como funciona o auth

O `globalSetup` (executado antes dos testes):
1. Autentica via Firebase REST API com email/senha → obtém `idToken`
2. Abre um browser, injeta o estado de auth no `localStorage` (onde Firebase Auth armazena por padrão)
3. Seta o cookie `axon_auth=1` (usado pelo AuthGuard para render otimista)
4. Salva o `storageState` em `e2e/.auth/user.json`

Os testes autenticados usam esse `storageState` → não precisam fazer login a cada teste.

### Notas

- `e2e/.auth/user.json` está no `.gitignore` (contém token de acesso real)
- O token expira em 1h — rode o `globalSetup` novamente se precisar
- Testes sem `E2E_EMAIL/E2E_PASSWORD` são pulados automaticamente (não falham)
