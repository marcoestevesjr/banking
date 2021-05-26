const Boom = require('@hapi/boom');

/* Define o método que retorna todas as contas cadastradas */
exports.search = async (request) => request.getModel('account').findAll();

/* Define o método que retorna uma nova conta dado um e-mail */
exports.add = async (request) => {
  const { email } = request.payload;

  /* Caso o 'email' fornecido já tenha sido cadastrado, retorna um erro informando o ocorrido */
  const exists = await request.getModel('account').count({ where: { email } }) > 0;
  if (exists) {
    return Boom.badRequest('account already exists');
  }

  /* Cria uma nova conta com o e-mail fornecido e o saldo inicialmente zerado */
  return request.getModel('account').create({
    email,
    balance: 0.0,
  });
};

/* Define o método que retorna uma determinada conta */
exports.find = async (request) => {
  const { id } = request.params;

  /* Caso o 'id' fornecido não tenha sido encontrado, retorna um erro informando o ocorrido */
  const exists = await request.getModel('account').count({ where: { id } }) > 0;
  if (!exists) {
    return Boom.notFound('account not exists');
  }

  return request.getModel('account').findOne({
    where: {
      id,
    },
  });
};

/* Define o método que remove uma determinada conta */
exports.remove = async (request) => {
  const { id } = request.params;

  /* Caso o 'id' fornecido não tenha sido encontrado, retorna um erro informando o ocorrido */
  const exists = await request.getModel('account').count({ where: { id } }) > 0;
  if (!exists) {
    return Boom.notFound('account not exists');
  }

  const account = await request.getModel('account').findOne({
    where: {
      id,
    },
  });

  /* Remove a conta com o id requisitado. */
  await account.destroy();

  return { message: 'account removed' };
};

/* Define o método que deposita um montante em uma determinada conta */
exports.deposit = async (request) => {
  const { id } = request.params;
  const { amount } = request.payload;

  /* Caso o 'id' fornecido não tenha sido encontrado, retorna um erro informando o ocorrido */
  const exists = await request.getModel('account').count({ where: { id } }) > 0;
  if (!exists) {
    return Boom.notFound('account not exists');
  }

  const account = await request.getModel('account').findOne({
    where: {
      id,
    },
  });

  /* Adiciona o montante ao saldo da conta solicitada. */
  account.balance += amount;

  await account.save();

  return { message: 'successfully deposited' };
};

/* Define o método que saca um montante de uma determinada conta */
exports.withdraw = async (request) => {
  const { id } = request.params;
  const { amount } = request.payload;

  /* Caso o 'id' fornecido não tenha sido encontrado, retorna um erro informando o ocorrido */
  const exists = await request.getModel('account').count({ where: { id } }) > 0;
  if (!exists) {
    return Boom.notFound('account not exists');
  }

  const account = await request.getModel('account').findOne({
    where: {
      id,
    },
  });

  /* Caso o montante seja maior do que o saldo disponível, retorna um erro informando o ocorrido */
  if (account.balance < amount) {
    return Boom.badRequest('account does not have enough balance');
  }

  /* Retira o montante do saldo da conta solicitada. */
  account.balance -= amount;

  await account.save();

  return { message: 'successfully withdrawn' };
};

/* Define o método que tranfere um montante de uma determinada conta para outra */
exports.transfer = async (request) => {
  const { source, target } = request.params;
  const { amount } = request.payload;

  /* Caso o 'source' fornecido não tenha sido encontrado, retorna um erro informando o ocorrido */
  const sourceExists = await request.getModel('account').count({ where: { id: source } }) > 0;
  if (!sourceExists) {
    return Boom.notFound('source account not exists');
  }

  /* Caso o 'target' fornecido não tenha sido encontrado, retorna um erro informando o ocorrido */
  const targetExists = await request.getModel('account').count({ where: { id: target } }) > 0;
  if (!targetExists) {
    return Boom.notFound('target account not exists');
  }

  const sourceAccount = await request.getModel('account').findOne({
    where: {
      id: source,
    },
  });

  /* Caso o montante seja maior do que o saldo disponível da conta origem,
    retorna um erro informando o ocorrido */
  if (sourceAccount.balance < amount) {
    return Boom.badRequest('source account does not have enough balance');
  }

  const targetAccount = await request.getModel('account').findOne({
    where: {
      id: target,
    },
  });

  /* Retira o montante do saldo da conta origem e adiciona o montante ao saldo da conta destino. */
  sourceAccount.balance -= amount;
  targetAccount.balance += amount;

  await sourceAccount.save();
  await targetAccount.save();

  return { message: 'successfully transferred' };
};
