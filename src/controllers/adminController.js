const FindBestProfessionService = require('../services/findBestProfessionService')
const FindBestClientsService = require('../services/findBestClientsService')

const BalancesController = {
  findBestProfession: async (req, res) =>{
    const { start, end } = req.query

    const startDate = new Date(start)
    const endDate = new Date(end)

    const profession = await FindBestProfessionService.call({ startDate, endDate })

    if(!profession) return res.status(404).end()
    res.json({ profession })
  },

  findBestClients: async (req, res) =>{
    const { start, end, limit } = req.query

    const startDate = new Date(start)
    const endDate = new Date(end)

    const clients = await FindBestClientsService.call({
      startDate,
      endDate,
      limit
    })

    if(clients.lenght == 0) return res.status(404).end()
    res.json(clients)
  },
}

module.exports = BalancesController
