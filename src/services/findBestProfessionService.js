const { sequelize } = require('../model')
const { Op } = require('sequelize')
const { Contract, Job, Profile } = sequelize.models

const FindBestProfessionService = {
  call: async ({ startDate, endDate }) => {
    const result = await Job.findAll({
      attributes: [
          'Contract.Contractor.profession',
          [sequelize.fn('sum', sequelize.col('Job.price')), 'totalAmount']
      ],
      include: [{ model: Contract, include: [{ model: Profile, as: 'Contractor'}] }],
      where: {
        paid: true,
        paymentDate: { [Op.between]: [startDate, endDate] }
      },
      group: 'Contract.Contractor.profession',
      order: [[sequelize.col("totalAmount"), 'DESC']],
      raw: true
    })

    const bestPaidProfession = result[0]

    if (!bestPaidProfession) return null

    return bestPaidProfession.profession
  }
}

module.exports = FindBestProfessionService
