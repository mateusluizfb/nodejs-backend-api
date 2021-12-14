const { sequelize } = require('../../../src/model')
const FindUnpaidJobsService = require('../../../src/services/findUnpaidJobsService')
const { Profile, Contract, Job } = sequelize.models

describe('FindUnpaidJobsService', () => {
  it('returns undpaid jobs', async () => {
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

    const job2 = await Job.create({
      description: 'development work 2',
      price: 200,
      ContractId: contract.id
    })

    const unpaidJobs = await FindUnpaidJobsService.call({ profile_id: client.id })

    expect(unpaidJobs[0].id).toEqual(job.id)
    expect(unpaidJobs[1].id).toEqual(job2.id)
  })

  it('doesnt return paid jobs', async () => {
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
      paid: true,
      ContractId: contract.id
    })

    const unpaidJobs = await FindUnpaidJobsService.call({ profile_id: client.id })

    expect(unpaidJobs.length).toEqual(0)
  })
})
