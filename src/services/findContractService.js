const { sequelize } = require('../model')
const { Op } = require('sequelize')

const FindContractService = {
  call: async ({ id, profile_id }) => {
    const { Contract } = sequelize.models

    return await Contract.findOne({
      where: {
        id: id,
        [Op.or]: [
          { ClientId: profile_id },
          { ContractorId: profile_id }
        ]
      }
    })
  }
}

module.exports = FindContractService
