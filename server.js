const Hapi = require('@hapi/hapi');

/* Plugins: Swagger, Sequelize */
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const HapiSequelize = require('hapi-sequelizejs');

/* Configurations */
const { swaggerConfig } = require('./configs/swagger.config');
const { sequelizeConfig } = require('./configs/sequelize.config');
const { serverConfig } = require('./configs/server.config');

/* Routes */
const routes = require('./routes/account.route');

const server = Hapi.server(serverConfig);

/* Configura o servidor registrando os plugins e suas respectivas rotas */
const config = async () => {
  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerConfig,
    },
    {
      plugin: HapiSequelize,
      options: sequelizeConfig,
    },
  ]);

  server.route(routes);
};

/* Exporta o método 'init' para configurar e inicializar o servidor para possibilitar os testes. */
exports.init = async () => {
  await config();
  await server.initialize();
  return server;
};

/* Exporta o método 'start' para configurar e inicializar o servidor. */
exports.start = async () => {
  await config();
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);// eslint-disable-line no-console
  return server;
};

/* Captura qualquer exceção não tratada e encerra o programa. */
process.on('unhandledRejection', (err) => {
  console.log(err);// eslint-disable-line no-console
  process.exit(1);
});
