const { sequelize } = require('../model')
const { Op } = require('sequelize')

const FindNonTerminatedContractsService = {
  call: async ({ id, profile_id }) => {
    const { Contract } = sequelize.models

    return await Contract.findOne({
      where: {
        status: ['new', 'in_progress'],
        [Op.or]: [
          { ClientId: profile_id },
          { ContractorId: profile_id }
        ]
      }
    })
  }
}

module.exports = FindNonTerminatedContractsService
