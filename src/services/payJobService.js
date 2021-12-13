const { sequelize } = require('../model')
const { Op } = require('sequelize')
const { Job, Profile } = sequelize.models

async function descreaseBalance(client, job) {
  const newBalance = client.balance - job.price

  return sequelize.transaction(async (t) => {
    await client.update({ balance: newBalance }, { transaction: t })
    await job.update({ paid: true, paymentDate: new Date().toISOString() }, { transaction: t })
  })
}

const PayJobService = {
  call: async ({ id, profile_id }) => {
    const job = await Job.findOne({ where: { id: id } })
    const client = await Profile.findOne({ where: { id: profile_id } })

    if (client.balance < job.price)
      return null

    await descreaseBalance(client, job)
    return await job.reload()
  }
}

module.exports = PayJobService
