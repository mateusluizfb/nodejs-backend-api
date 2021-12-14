const FindBestProfessionService = require('../services/findBestProfessionService')

const BalancesController = {
  findBestProfession: async (req, res) =>{
    const { start, end } = req.query

    const startDate = new Date(start)
    const endDate = new Date(end)

    const profession = await FindBestProfessionService.call({ startDate, endDate })

    if(!profession) return res.status(404).end()
    res.json({ profession })
  },
}

module.exports = BalancesController
