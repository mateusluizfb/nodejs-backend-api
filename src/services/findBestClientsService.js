const { sequelize } = require('../model')
const { Op } = require('sequelize')
const { Contract, Job, Profile } = sequelize.models

const DEFAULT_LIMIT = 2

function formatResponse(result) {
  return result.map((client) => ({
    id: client['Contract.Client.id'],
    fullName: `${client['Contract.Client.firstName']} ${client['Contract.Client.lastName']}`,
    paid: client['totalAmount']
  }))
}

const FindBestClientsService = {
  call: async ({ startDate, endDate, limit }) => {
    const result = await Job.findAll({
      attributes: [
          [sequelize.fn('sum', sequelize.col('Job.price')), 'totalAmount']
      ],
      include: [{ model: Contract, include: [{ model: Profile, as: 'Client'}] }],
      where: {
        paid: true,
        paymentDate: { [Op.between]: [startDate, endDate] }
      },
      group: 'Contract.Client.id',
      order: [[sequelize.col("totalAmount"), 'DESC']],
      limit: limit || DEFAULT_LIMIT,
      raw: true
    })

    if (!result[0]) return []

    return formatResponse(result)
  }
}

module.exports = FindBestClientsService
