const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { validUser } = require('../fixtures/users');

test.describe('Regression - Login - ServeRest Front', () => {
  /** @type {LoginPage} */
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
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

    await expect(page).not.toHaveURL(/\/home/);
  });
});
