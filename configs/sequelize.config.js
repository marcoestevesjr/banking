/* Configuração do Sequelize */
const { Sequelize } = require('sequelize');

exports.sequelizeConfig = [
  {
    name: 'db',
    models: ['models/*.js'],
    sequelize: new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
    }),
    sync: true,
  },
];
