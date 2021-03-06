const DepositMoneyService = require('../services/depositMoneyService')

const BalancesController = {
  // POST
  // route: /balances/deposit/:userId
  // params:
  // - userId: <Number>
  // - amount: <Number>
  deposit: async (req, res) =>{
    const { userId } = req.params
    const amount = req.body.amount

    const profile = await DepositMoneyService.call({
      amount: amount,
      originProfileId: req.profile.id,
      destinationProfileId: userId
    })

    if(!profile) return res.status(404).end()
    res.json(profile)
  },
}

module.exports = BalancesController
