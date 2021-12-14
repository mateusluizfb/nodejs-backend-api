const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model')
const { getProfile } = require('./middleware/getProfile')
const {
  ContractsController,
  JobsController,
  BalancesController,
  AdminController
} = require('./controllers')

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

app.get('/contracts/:id', getProfile, ContractsController.getContract)
app.get('/contracts', getProfile, ContractsController.getNonTerminatedContracts)
app.get('/jobs/unpaid', getProfile, JobsController.getUnpaid)
app.post('/jobs/:job_id/pay', getProfile, JobsController.pay)
app.post('/balances/deposit/:userId', getProfile, BalancesController.deposit)
app.get('/admin/best-profession', getProfile, AdminController.findBestProfession)

module.exports = app;
