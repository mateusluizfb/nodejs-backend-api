const { sequelize } = require('../../../src/model')
const PayJobService = require('../../../src/services/payJobService')
const { Profile, Contract, Job } = sequelize.models

describe('PayJobService', () => {
  it('pays a job', async () => {
    await Profile.sync({ force: true });
    await Contract.sync({ force: true });
    await Job.sync({ force: true });

    const client = await Profile.create({
      firstName: 'John',
      lastName: 'Doe',
      profession: 'Developer',
      balance: 1000,
      type: 'client'
    })

    const contractor = await Profile.create({
      firstName: 'Google',
      lastName: 'Inc',
      profession: 'company',
      balance: 0,
      type: 'contractor'
    })

    const contract = await Contract.create({
      terms: 'this is a term',
      status: 'in_progress',
      ClientId: client.id,
      ContractorId: contractor.id
    })

    const job = await Job.create({
      description: 'development work',
      price: 200,
      ContractId: contract.id
    })

    const paidJob = await PayJobService.call({ id: job.id, profile_id: client.id })
    await contractor.reload()
    await client.reload()

    expect(paidJob.paid).toEqual(true)
    expect(contractor.balance).toEqual(200)
    expect(client.balance).toEqual(800)
  })
})
