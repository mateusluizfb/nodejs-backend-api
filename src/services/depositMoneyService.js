const { sequelize } = require('../model')
const { Op } = require('sequelize')
const { Job, Profile, Contract } = sequelize.models

async function depositMoney(amount, client) {
  return sequelize.transaction(async (t) => {
    await client.update({ balance: (client.balance + amount) }, { transaction: t })
  })
}

const DepositMoneyService = {
  call: async ({ amount, id }) => {
    const client = await Profile.findOne({ where: { id: id } })
    await depositMoney(amount, client)
    return await client.reload()
  }
}

module.exports = DepositMoneyService
