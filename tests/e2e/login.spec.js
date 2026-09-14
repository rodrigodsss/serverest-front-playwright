// tests/e2e/login.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { validUser } = require('../fixtures/users');

test.describe('Login - ServeRest Front', () => {
  /** @type {LoginPage} */
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('login com credenciais válidas redireciona para a home', async ({ page }) => {
    await loginPage.login(validUser.email, validUser.password);

    await expect(page).toHaveURL(/\/admin\/home/);
    await expect(page.getByRole('heading', { name: /Bem Vindo/i })).toBeVisible();
  });

  test('login com email não cadastrado exibe mensagem de erro', async () => {
    await loginPage.login('naoexiste_' + Date.now() + '@qa.com', 'qualquerSenha123');

    await expect(loginPage.invalidCredentialsMessage).toBeVisible();
  });

  test('login com senha incorreta para email válido exibe mensagem de erro', async () => {
    await loginPage.login(validUser.email, 'senhaErrada123');

    await expect(loginPage.invalidCredentialsMessage).toBeVisible();
  });

  test('email e senha vazios exibem as duas validações obrigatórias', async () => {
    await loginPage.submit();

    await expect(loginPage.emailRequiredMessage).toBeVisible();
    await expect(loginPage.passwordRequiredMessage).toBeVisible();
  });

  test('apenas email vazio exibe validação de campo obrigatório', async () => {
    await loginPage.fillPassword(validUser.password);
    await loginPage.submit();

    await expect(loginPage.emailRequiredMessage).toBeVisible();
    await expect(loginPage.passwordRequiredMessage).not.toBeVisible();
  });

  test('apenas senha vazia exibe validação de campo obrigatório', async () => {
    await loginPage.fillEmail(validUser.email);
    await loginPage.submit();

    await expect(loginPage.passwordRequiredMessage).toBeVisible();
    await expect(loginPage.emailRequiredMessage).not.toBeVisible();
  });

  test('email com formato inválido não permite envio ou exibe validação de formato', async ({ page }) => {
    await loginPage.login('emailsemformato', validUser.password);

    // O ServeRest não navega para /home quando o formato do email é inválido.
    await expect(page).not.toHaveURL(/\/home/);
  });

  test('link "Cadastre-se" navega para a tela de cadastro de usuários', async ({ page }) => {
    await loginPage.cadastrarLink.click();

    await expect(page).toHaveURL(/\/cadastrarusuarios/);
  });
});
