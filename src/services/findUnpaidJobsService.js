const { sequelize } = require('../model')
const { Op } = require('sequelize')

const FindUnpaidJobsService = {
  call: async ({ profile_id }) => {
    const { Job, Contract } = sequelize.models

    return await Job.findAll({
      include: [{
        model: Contract,
        where: {
          status: ['new', 'in_progress'],
          [Op.or]: [
            { ClientId: profile_id },
            { ContractorId: profile_id },
          ]
        }
      }],
      where: {
        paid: true
      }
    })
  }
}

module.exports = FindUnpaidJobsService
