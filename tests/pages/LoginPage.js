// tests/pages/LoginPage.js
//
// ATENÇÃO: os seletores abaixo seguem a estrutura conhecida/documentada do
// front-end do ServeRest (ids "email", "password", "entrar" e as mensagens
// de validação em português). Como não foi possível inspecionar o DOM ao
// vivo nesta sessão, valide-os com `npx playwright codegen
// https://front.serverest.dev/login` ou via Playwright MCP + Claude Code
// (veja MCP-CLAUDE-WORKFLOW.md) antes de rodar a suíte pela primeira vez.

class LoginPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#entrar');
    this.cadastrarLink = page.locator('a[href="/cadastrarusuarios"]');

    // Mensagem exibida quando email/senha não conferem com nenhum usuário
    this.invalidCredentialsMessage = page.getByText('Email e/ou senha inválidos');

    // Mensagens de campo obrigatório (react-hook-form)
    this.emailRequiredMessage = page.getByText('Email é obrigatório');
    this.passwordRequiredMessage = page.getByText('Password é obrigatório');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async fillEmail(email) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password) {
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.loginButton.click();
  }

  /**
   * Preenche email/senha e submete. Passe null/undefined para deixar
   * o campo vazio (não digita nada nele).
   */
  async login(email, password) {
    if (email !== undefined && email !== null) await this.fillEmail(email);
    if (password !== undefined && password !== null) await this.fillPassword(password);
    await this.submit();
  }
}

module.exports = { LoginPage };
