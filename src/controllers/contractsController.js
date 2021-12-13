const FindContractService = require('../services/findContractService')
const FindNonTerminatedContractService = require('../services/findNonTerminatedContractsService')

const ContractsController = {
  getContract: async (req, res) =>{
    const {id} = req.params
    const contract = await FindContractService.call({id, profile_id: req.profile.id })
    if(!contract) return res.status(404).end()
    res.json(contract)
  },

  getNonTerminatedContracts: async (req, res) =>{
    const contract = await FindNonTerminatedContractService.call({profile_id: req.profile.id })
    if(!contract) return res.status(404).end()
    res.json(contract)
  }
}

module.exports = ContractsController
