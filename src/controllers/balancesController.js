const BalancesController = {
  deposit: async (req, res) =>{
    const {id} = req.params
    // const contract = await FindContractService.call({id, profile_id: req.profile.id })
    if(!contract) return res.status(404).end()
    res.json(contract)
  },
}

module.exports = BalancesController
