const { sequelize } = require('../model')
const { Op } = require('sequelize')
const { Job, Profile, Contract } = sequelize.models

const DEPOSIT_TRESHHOLD = 1.25

async function depositMoney(amount, originProfile, destinationProfile) {
  return sequelize.transaction(async (t) => {
    const originProfileBalance = originProfile.balance
    const destinationProfileBalance = destinationProfile.balance

    await originProfile.update(
      { balance: (originProfileBalance - amount) },
      { transaction: t }
    )
    await destinationProfile.update(
      { balance: (destinationProfileBalance + amount) },
      { transaction: t }
    )
  })
}

async function isDepositValid(amount, client) {
  const total = await Job.sum('price', {
    include: [{
      model: Contract,
      where: { ClientId: client.id }
    }]
  })

  return amount < (total * DEPOSIT_TRESHHOLD)
}

const DepositMoneyService = {
  call: async ({ amount, originProfileId, destinationProfileId }) => {
    const originProfile = await Profile.findOne({ where: { id: originProfileId } })
    const destinationProfile = await Profile.findOne({ where: { id: destinationProfileId } })

    if (await isDepositValid(amount, originProfile)) {
      await depositMoney(amount, originProfile, destinationProfile)
      return await originProfile.reload()
    }

    return null
  }
}

module.exports = DepositMoneyService
