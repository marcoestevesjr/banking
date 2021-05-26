/* Definição da tabela 'account' com o respectivo e-mail e saldo do cliente */
module.exports = (sequelize, DataTypes) => sequelize.define('account', {
  email: DataTypes.STRING,
  balance: DataTypes.DOUBLE,
});
