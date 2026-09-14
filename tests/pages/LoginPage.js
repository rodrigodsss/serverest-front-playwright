// tests/pages/LoginPage.js
//
// Seletores focados em acessibilidade e na interface atual do ServeRest.
// Isso reduz a fragilidade do Page Object Model quando o front muda pequenos
// detalhes visuais ou de atributos, mantendo o teste estável.

class LoginPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    this.emailInput = page.getByPlaceholder('Digite seu email');
    this.passwordInput = page.getByPlaceholder('Digite sua senha');
    this.loginButton = page.getByRole('button', { name: 'Entrar' });
    this.cadastrarLink = page.locator('[data-testid="cadastrar"]');

    // Mensagem exibida quando email/senha não conferem com nenhum usuário
    this.invalidCredentialsMessage = page.getByText('Email e/ou senha inválidos');

    // Mensagens de campo obrigatório
    // O componente de validação do front é renderizado em um container .alert,
    // então usamos um filtro por texto para evitar flakiness entre browsers.
    this.emailRequiredMessage = page.locator('.alert').filter({ hasText: 'Email é obrigatório' });
    this.passwordRequiredMessage = page.locator('.alert').filter({ hasText: 'Password é obrigatório' });
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
