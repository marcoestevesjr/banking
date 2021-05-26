const Joi = require('joi');

const {
  search, add, find, remove, deposit, withdraw, transfer,
} = require('../handlers/account.handler');

/* Cria as rotas da aplicação, define as validações necessárias e descreve cada operação. */
module.exports = [
  /* Define a rota que retorna todas as contas cadastradas. */
  {
    method: 'GET',
    path: '/accounts',
    handler: search,
    options: {
      tags: ['api'],
      description: 'Get all accounts',
      notes: 'Returns a list with all accounts',
    },
  },
  /* Define a rota que retorna uma nova conta.
    É necessário fornecer um email válido. */
  {
    method: 'POST',
    path: '/accounts',
    handler: add,
    options: {
      tags: ['api'],
      description: 'Create a new account',
      notes: 'Returns a new account with the requested email',
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required().description('the email of the new account'),
        }).label('New account request'),
        failAction: (request, h, err) => {
          throw err;
        },
      },
    },
  },
  /* Define a rota que retorna uma conta.
    É necessário fornecer um id válido. */
  {
    method: 'GET',
    path: '/accounts/{id}',
    handler: find,
    options: {
      tags: ['api'],
      description: 'Find an account',
      notes: 'Returns an account with the requested id',
      validate: {
        params: Joi.object({
          id: Joi.number().integer().min(1).required()
            .description('the account id of the requested account'),
        }),
        failAction: (request, h, err) => {
          throw err;
        },
      },
    },
  },
  /* Define a rota que deleta uma conta.
    É necessário fornecer um id válido. */
  {
    method: 'DELETE',
    path: '/accounts/{id}',
    handler: remove,
    options: {
      tags: ['api'],
      description: 'Remove an account',
      notes: 'Remove an account with the requested id',
      validate: {
        params: Joi.object({
          id: Joi.number().integer().min(1).required()
            .description('the account id of the requested account'),
        }),
        failAction: (request, h, err) => {
          throw err;
        },
      },
    },
  },
  /* Define a rota que deposita um montante em uma conta.
     É necessário fornecer um id válido e um montante maior que 0.01. */
  {
    method: 'POST',
    path: '/accounts/{id}/deposit',
    handler: deposit,
    options: {
      tags: ['api'],
      description: 'Deposit on the account',
      notes: 'Deposit on the account with the requested id and amount',
      validate: {
        params: Joi.object({
          id: Joi.number().integer().min(1).required()
            .description('the account id of the requested deposit'),
        }),
        payload: Joi.object({
          amount: Joi.number().min(0.01).required().description('the amount of the requested deposit'),
        }).label('Deposit request'),
        failAction: (request, h, err) => {
          throw err;
        },
      },
    },
  },
  /* Define a rota que saca um montante de uma conta.
     É necessário fornecer um id válido e um montante maior que 0.01. */
  {
    method: 'POST',
    path: '/accounts/{id}/withdraw',
    handler: withdraw,
    options: {
      tags: ['api'],
      description: 'Withdraw from the account',
      notes: 'Withdraw from the account with the requested id and amount',
      validate: {
        params: Joi.object({
          id: Joi.number().integer().min(1).required()
            .description('the account id of the requested withdraw'),
        }),
        payload: Joi.object({
          amount: Joi.number().min(0.01).required().description('the amount of the requested withdraw'),
        }).label('Withdraw request'),
        failAction: (request, h, err) => {
          throw err;
        },
      },
    },
  },
  /* Define a rota que transferer um montante de uma conta para outra.
     É necessário fornecer um source e target válidos e um montante maior que 0.01. */
  {
    method: 'POST',
    path: '/accounts/{source}/transfer/{target}',
    handler: transfer,
    options: {
      tags: ['api'],
      description: 'Transfer between accounts',
      notes: 'Transfer between accounts with the requested source id, target id and amount',
      validate: {
        params: Joi.object({
          source: Joi.number().integer().min(1).required()
            .description('the source account id of the requested transfer'),
          target: Joi.number().integer().min(1).required()
            .description('the target account id of the requested transfer'),
        }),
        payload: Joi.object({
          amount: Joi.number().min(0.01).required().description('the amount of the requested transfer'),
        }).label('Transfer request'),
        failAction: (request, h, err) => {
          throw err;
        },
      },
    },
  },
];
