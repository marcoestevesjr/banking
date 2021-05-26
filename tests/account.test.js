const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');

const {
  after, before, describe, it,
} = exports.lab = Lab.script(); // eslint-disable-line no-multi-assign

const { init } = require('../server');

/* Cria um teste para cada endpoint da API daquilo que seria um fluxo comum na aplicação */
describe('Testing accounts endpoints', () => {
  let server;

  /* Antes de iniciar qualquer teste, inicia o servidor */
  before(async () => {
    server = await init();
  });

  /* Depois do término dos testes, desliga o servidor */
  after(async () => {
    await server.stop();
  });

  /* Requisita todas as contas cadastradas no sistema */
  it('Find all accounts', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/accounts',
    });
    expect(res.statusCode).to.equal(200);
  });

  /* Cria duas novas contas para realizar operações entre elas */
  let account1 = -1;
  let account2 = -1;

  it('Create new accounts', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/accounts',
      payload: {
        email: 'test1@test.com',
      },
    });
    expect(res.statusCode).to.equal(200);
    account1 = res.result.id;

    const res2 = await server.inject({
      method: 'POST',
      url: '/accounts',
      payload: {
        email: 'test2@test.com',
      },
    });
    expect(res2.statusCode).to.equal(200);
    account2 = res2.result.id;
  });

  /* Faz um depósito na conta 1 */
  it('Deposit in the account', async () => {
    const res = await server.inject({
      method: 'POST',
      url: `/accounts/${account1}/deposit`,
      payload: {
        amount: 100,
      },
    });
    expect(res.statusCode).to.equal(200);
  });

  /* Transfere dinheiro da conta 1 para a conta 2 */
  it('Transfer to another account', async () => {
    const res = await server.inject({
      method: 'POST',
      url: `/accounts/${account1}/transfer/${account2}`,
      payload: {
        amount: 50,
      },
    });
    expect(res.statusCode).to.equal(200);
  });

  /* Saca o dinheiro da conta 1 */
  it('Withdraw from account', async () => {
    const res = await server.inject({
      method: 'POST',
      url: `/accounts/${account1}/withdraw`,
      payload: {
        amount: 50,
      },
    });
    expect(res.statusCode).to.equal(200);
  });

  /* Verifica os saldos da conta 1 e conta 2 */
  it('Check balance of the accounts', async () => {
    const res = await server.inject({
      method: 'GET',
      url: `/accounts/${account1}`,
    });
    expect(res.statusCode).to.equal(200);
    expect(res.result.balance).to.equal(0);

    const res2 = await server.inject({
      method: 'GET',
      url: `/accounts/${account2}`,
    });
    expect(res2.statusCode).to.equal(200);
    expect(res2.result.balance).to.equal(50);
  });

  /* Deleta a conta 1 e conta 2 */
  it('Delete the accounts', async () => {
    const res = await server.inject({
      method: 'DELETE',
      url: `/accounts/${account1}`,
    });
    expect(res.statusCode).to.equal(200);

    const res2 = await server.inject({
      method: 'GET',
      url: `/accounts/${account2}`,
    });
    expect(res2.statusCode).to.equal(200);
  });
});
