const FindContractService = require('../services/findContractService')
const FindNonTerminatedContractService = require('../services/findNonTerminatedContractsService')

const ContractsController = {
  // GET
  // route: /contracts/:id
  // params:
  // - id: <Number>
  getContract: async (req, res) =>{
    const {id} = req.params
    const contract = await FindContractService.call({id, profile_id: req.profile.id })
    if(!contract) return res.status(404).end()
    res.json(contract)
  },

  // GET
  // route: /contracts
  getNonTerminatedContracts: async (req, res) =>{
    const contracts = await FindNonTerminatedContractService.call({profile_id: req.profile.id })
    res.json(contracts)
  }
}

module.exports = ContractsController
