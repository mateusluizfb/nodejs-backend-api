const { sequelize } = require('../../../src/model')
const PayJobService = require('../../../src/services/payJobService')
const { Profile, Contract, Job } = sequelize.models

describe('PayJobService', () => {
  it('pays a job', async () => {
    const client = await Profile.create({
      firstName: 'John',
      lastName: 'Doe',
      profession: 'Developer',
      balance: 100,
      type: 'client'
    })

    const contractor = await Profile.create({
      firstName: 'Google',
      lastName: 'Inc',
      profession: 'company',
      balance: 1000,
      type: 'contractor'
    })

    const contract = await Contract.create({
      terms: 'this is a term',
      status: 'in_progress',
      ClientId: 1,
      ContractorId: 2
    })

    const job = await Job.create({
      description: 'development work',
      price: 200,
      ContractId: 1
    })

    const paidJob = await PayJobService.call({ id: job.id, profile_id: contractor.id })
    await contractor.reload()

    expect(paidJob.paid).toEqual(true)
    expect(contractor.balance).toEqual(800)
  })
})
