# 🧪 ServeRest Front — Testes E2E com Playwright

[![Playwright Tests](https://img.shields.io/badge/tests-Playwright-45ba4b?logo=playwright&logoColor=white)](https://playwright.dev)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![CI](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white)](.github/workflows/playwright.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](#-licença)

Suíte de testes end-to-end para a tela de login do front-end do
[ServeRest](https://front.serverest.dev/login), construída com **Playwright**
e **Page Object Model**, com pipeline de CI no GitHub Actions.

Este projeto faz parte do meu portfólio de QA Automation / SDET — outros
projetos: veja o [perfil do GitHub](https://github.com/rodrigodsss).

---

## 📋 Sobre o projeto

O objetivo foi cobrir de ponta a ponta os principais fluxos e regras de
validação da tela de login do ServeRest, aplicando boas práticas de
automação: Page Object Model, massa de dados dinâmica com `faker`, execução
cross-browser e relatório HTML no CI.

## ✅ Cenários cobertos

| # | Cenário | Resultado esperado |
|---|---------|---------------------|
| 1 | Login com credenciais válidas | Redireciona para `/home` |
| 2 | Login com email não cadastrado | Mensagem "Email e/ou senha inválidos" |
| 3 | Login com senha incorreta para email válido | Mensagem "Email e/ou senha inválidos" |
| 4 | Email e senha vazios | Exibe as duas validações obrigatórias |
| 5 | Apenas email vazio | Exibe validação de email obrigatório |
| 6 | Apenas senha vazia | Exibe validação de senha obrigatória |
| 7 | Email com formato inválido | Não navega para `/home` |
| 8 | Clique em "Cadastre-se" | Navega para `/cadastrarusuarios` |

## 🛠️ Stack

- [Playwright](https://playwright.dev) (JavaScript)
- Page Object Model
- [`@faker-js/faker`](https://github.com/faker-js/faker) para massa de dados
- GitHub Actions (CI) com publicação do relatório HTML como artefato
- Execução cross-browser: Chromium, Firefox e WebKit

## 📁 Estrutura

\`\`\`
serverest-front-playwright/
├── .github/workflows/playwright.yml   # Pipeline de CI
├── tests/
│   ├── pages/LoginPage.js             # Page Object da tela de login
│   ├── fixtures/users.js              # Massa de dados
│   └── login.spec.js                  # Casos de teste
├── playwright.config.js
├── package.json
└── MCP-CLAUDE-WORKFLOW.md             # Como usar Playwright MCP + Claude Code no projeto
\`\`\`

## 🚀 Como rodar localmente

\`\`\`bash
git clone https://github.com/rodrigodsss/serverest-front-playwright.git
cd serverest-front-playwright
npm install
npx playwright install

npm test              # roda em todos os browsers configurados
npm run test:headed   # com navegador visível
npm run test:ui       # UI mode do Playwright, ótimo para debugar
npm run report        # abre o último relatório HTML
\`\`\`

## 🤖 CI/CD

Todo push/PR para \`main\` dispara o workflow
[\`playwright.yml\`](.github/workflows/playwright.yml), que instala as
dependências, roda a suíte completa e publica o relatório HTML como artefato
do GitHub Actions.

## 📑 Plano de Testes

A documentação completa do plano de testes (escopo, estratégia, critérios de
entrada/saída, matriz de rastreabilidade e riscos) está em
[`docs/TEST_PLAN.md`](docs/TEST_PLAN.md).

## 🔌 Playwright MCP + Claude Code

Este projeto documenta, em [\`MCP-CLAUDE-WORKFLOW.md\`](MCP-CLAUDE-WORKFLOW.md),
como conectar o servidor oficial **Playwright MCP** ao Claude Code para
validar seletores contra o DOM real, gerar novos cenários de teste e depurar
falhas — mantendo o Page Object Model como padrão.

## ⚠️ Nota sobre os seletores

Os seletores em \`LoginPage.js\` foram montados com base na estrutura
conhecida/documentada do ServeRest, mas recomenda-se validá-los contra o DOM
real com \`npx playwright codegen https://front.serverest.dev/login\` ou via
Playwright MCP antes de considerar a suíte 100% confiável em produção.

## 📬 Contato

- LinkedIn: [linkedin.com/in/rodrigo-sousa-qa](https://www.linkedin.com/in/rodrigo-sousa-qa/)
- Email: rodrigodss89@gmail.com

## 📄 Licença

Este projeto está sob a licença MIT.
