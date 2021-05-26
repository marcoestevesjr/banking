# Banking API Demo

Banking API with basic operations created with Hapi. The default configuration starts the server at `localhost:3000` with in-memory SQLite database.

### Plugins:
* [hapi-sequelizejs](https://github.com/glennjones/hapi-swagger)
* [hapi-swagger](https://github.com/bakjs/hapi-sequelize)

### Documentation:

`GET /documentation`

### Operations:

* Get all accounts : `GET /accounts`
* Create an account : `POST /accounts/`
* Find an account : `GET /accounts/{id}`
* Delete an account : `DELETE /accounts/{id}`
* Deposit in an account : `POST /accounts/{id}/deposit`
* Withdraw from an account : `POST /accounts/{id}/withdraw`
* Transfer between accounts : `POST /accounts/{source}/transfer/{target}`
