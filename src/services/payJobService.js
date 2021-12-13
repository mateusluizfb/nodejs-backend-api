const { sequelize } = require('../model')
const { Op } = require('sequelize')
const { Job, Profile, Contract } = sequelize.models

async function descreaseBalance(client, job) {
  const contractorId = job.Contract.ContractorId
  const contractor = await Profile.findOne({ where: { id: contractorId } })
  const newBalance = client.balance - job.price

  return sequelize.transaction(async (t) => {
    console.log(contractor);
    await contractor.update({ balance: (contractor.balance + job.price) }, { transaction: t })
    await client.update({ balance: newBalance }, { transaction: t })
    await job.update({ paid: true, paymentDate: new Date().toISOString() }, { transaction: t })
  })
}

const PayJobService = {
  call: async ({ id, profile_id }) => {
    const job = await Job.findOne({ include: [{model: Contract }], where: { id: id } })
    const client = await Profile.findOne({ where: { id: profile_id } })

    if (client.balance < job.price)
      return null

    await descreaseBalance(client, job)
    return await job.reload()
  }
}

module.exports = PayJobService
