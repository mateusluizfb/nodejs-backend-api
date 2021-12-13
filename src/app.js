const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const {getProfile} = require('./middleware/getProfile')
const FindContractService = require('./services/findContractService')
const FindNonTerminatedContractService = require('./services/findNonTerminatedContractsService')

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

/**
 * @returns contract by id and profile
 */
app.get('/contracts/:id', getProfile, async (req, res) =>{
    const {id} = req.params
    const contract = await FindContractService.call({id, profile_id: req.profile.id })
    if(!contract) return res.status(404).end()
    res.json(contract)
})

/**
 * @returns non terminated contracts
 */
app.get('/contracts', getProfile, async (req, res) =>{
    const {id} = req.params
    const contract = await FindNonTerminatedContractService.call({profile_id: req.profile.id })
    if(!contract) return res.status(404).end()
    res.json(contract)
})

module.exports = app;
