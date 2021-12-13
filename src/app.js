const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model')
const { getProfile } = require('./middleware/getProfile')
const { ContractsController } = require('./controllers')

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

app.get('/contracts/:id', getProfile, ContractsController.getContract)
app.get('/contracts', getProfile, ContractsController.getNonTerminatedContracts)

module.exports = app;
