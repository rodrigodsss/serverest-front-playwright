const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { validUser } = require('../fixtures/users');

test.describe('Smoke - Login - ServeRest Front', () => {
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

  test('link "Cadastre-se" navega para a tela de cadastro de usuários', async ({ page }) => {
    await loginPage.cadastrarLink.click();

    await expect(page).toHaveURL(/\/cadastrarusuarios/);
  });
});
