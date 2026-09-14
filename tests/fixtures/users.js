// tests/fixtures/users.js
//
// Usuário administrador público de exemplo, divulgado na própria home do
// ServeRest (https://front.serverest.dev) para fins de teste.
// Ajuste para um usuário seu (criado via API ou tela de cadastro) se quiser
// isolar sua massa de dados do restante da comunidade.

const { faker } = require('@faker-js/faker');

const validUser = {
  email: 'fulano@qa.com',
  password: 'teste',
};

function randomUser() {
  return {
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 10 }),
    administrador: 'false',
  };
}

module.exports = { validUser, randomUser };
