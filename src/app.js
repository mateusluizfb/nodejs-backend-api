const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model')
const { getProfile } = require('./middleware/getProfile')
const { ContractsController, JobsController } = require('./controllers')

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

app.get('/contracts/:id', getProfile, ContractsController.getContract)
app.get('/contracts', getProfile, ContractsController.getNonTerminatedContracts)
app.get('/jobs/unpaid', getProfile, JobsController.getUnpaid)
app.get('/jobs/:job_id/pay', getProfile, JobsController.pay)

module.exports = app;
