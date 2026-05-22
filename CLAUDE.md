@AGENTS.md

# Regras obrigatórias ao finalizar qualquer tarefa

Ao concluir qualquer conjunto de alterações de código, SEMPRE executar na ordem:

1. `git add` nos arquivos modificados/criados
2. `git commit -m "mensagem descritiva"`
3. `git push origin main`
4. `vercel --prod` para deploy em produção
5. `npm run test:e2e` para rodar os testes E2E de smoke contra produção
6. Criar log de status em `/Users/kirchner/Ozzy/Kirchner-Dev/MindDoctor - App/Logs/` com nome `LOG-YYYY-MM-DD-<feature>.md` contendo:
   - O que foi feito (resumo)
   - Arquivos criados/modificados
   - Resultado dos testes E2E (passou/falhou por rota)
   - Commit hash + URL de produção
   - Próximos passos

Isso é obrigatório — não perguntar, não pular, não aguardar instrução.
