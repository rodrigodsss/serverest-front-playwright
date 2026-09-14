# Usando Playwright MCP + Claude Code neste projeto

O **Playwright MCP** (servidor oficial da Microsoft, pacote `@playwright/mcp`)
expõe um navegador real como ferramenta para o Claude via **Model Context
Protocol**. Ao contrário do Claude no chat, o **Claude Code** (CLI) rodando
na sua máquina consegue abrir esse navegador, navegar, inspecionar o DOM via
snapshot de acessibilidade, clicar e digitar — o que permite usá-lo para:

1. **Validar/corrigir os seletores** deste projeto contra a página real;
2. **Gerar novos casos de teste** a partir de descrições em linguagem natural;
3. **Fazer "self-healing"** de locators quando o front mudar.

## 1. Instalar e conectar o servidor MCP

No terminal (fora de uma sessão do `claude`), na raiz do projeto:

```bash
claude mcp add --scope project playwright -- npx -y @playwright/mcp@latest
```

- `--scope project` grava a configuração em `.mcp.json` na raiz do projeto,
  então ela pode ser versionada e compartilhada com o time.
- Depois, abra uma sessão (`claude`) e rode `/mcp` para confirmar que o
  servidor `playwright` está conectado.

## 2. Validar os seletores do LoginPage

Com o MCP conectado, peça ao Claude Code para navegar e comparar:

```
Abra https://front.serverest.dev/login com o Playwright MCP, tire um
snapshot de acessibilidade da página e compare os seletores reais (email,
senha, botão de entrar, link de cadastro e as mensagens de validação) com
os que estão em tests/pages/LoginPage.js. Corrija o arquivo se houver
qualquer divergência.
```

O Claude Code vai navegar de verdade, inspecionar os elementos e editar o
arquivo diretamente — sem você precisar abrir o DevTools manualmente.

## 3. Gerar novos cenários de teste

```
Usando o Playwright MCP, explore o fluxo de "Esqueci minha senha" (se
existir) em https://front.serverest.dev/login e crie um novo arquivo de
teste tests/recuperar-senha.spec.js seguindo o mesmo padrão de Page Object
usado em LoginPage.js.
```

Como o Claude Code está navegando de fato na página, os seletores e o fluxo
gerados tendem a ser mais precisos do que uma suposição feita só a partir de
uma descrição em texto.

## 4. Rodar e depurar os testes existentes

O Claude Code também pode rodar a suíte e usar o resultado para se corrigir:

```
Rode `npx playwright test`. Se algum teste falhar, use o Playwright MCP
para abrir a página manualmente, entender por que o seletor não bateu, e
corrija o LoginPage.js ou o teste.
```

## 5. Boas práticas

- Mantenha `.mcp.json` no repositório (escopo `project`) para que qualquer
  pessoa do time tenha o mesmo servidor MCP disponível ao clonar o projeto.
- Prefira pedir para o Claude Code **explicar o diff** antes de aceitar
  mudanças em massa nos seletores — assim você revisa o que foi alterado.
- Esse fluxo substitui bem o `playwright codegen` manual quando você quer
  que a geração do teste já venha em Page Object Model e no estilo do
  restante do projeto.
