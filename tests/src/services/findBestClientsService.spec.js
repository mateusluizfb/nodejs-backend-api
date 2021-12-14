const { sequelize } = require('../../../src/model')
const FindBestClientsService = require('../../../src/services/findBestClientsService')
const { Profile, Contract, Job } = sequelize.models

describe('FindBestClientsService', () => {
  it('returns client who most paid', async () => {
    await Profile.sync({ force: true });
    await Contract.sync({ force: true });
    await Job.sync({ force: true });

    const client = await Profile.create({
      firstName: 'Deel',
      lastName: 'Inc',
      profession: 'client',
      balance: 1000,
      type: 'client'
    })

    const contractor = await Profile.create({
      firstName: 'John',
      lastName: 'Doe',
      profession: 'Developer',
      balance: 200,
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
      ContractId: contract.id,
      paid: true,
      paymentDate: new Date("2021-01-10 00:00:00")
    })

    const startDate = new Date("2021-01-01 00:00:00");
    const endDate = new Date("2021-01-30 00:00:00");
    const limit = 2;

    const result = await FindBestClientsService.call({
      startDate,
      endDate,
      limit
    })

    expect(result).toEqual(
      [
        {
          id: client.id,
          fullName: 'Deel Inc',
          paid: 200
        }
      ]
    )
  })

  it('doesnt return client for dates without jobs', async () => {
    await Profile.sync({ force: true });
    await Contract.sync({ force: true });
    await Job.sync({ force: true });

    const client = await Profile.create({
      firstName: 'Deel',
      lastName: 'Inc',
      profession: 'client',
      balance: 1000,
      type: 'client'
    })

    const contractor = await Profile.create({
      firstName: 'John',
      lastName: 'Doe',
      profession: 'Developer',
      balance: 200,
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
      ContractId: contract.id,
      paid: true,
      paymentDate: new Date("2021-01-10 00:00:00")
    })

    const startDate = new Date("2021-02-01 00:00:00");
    const endDate = new Date("2021-02-30 00:00:00");
    const limit = 2;

    const result = await FindBestClientsService.call({
      startDate,
      endDate,
      limit
    })

    expect(result).toEqual([])
  })
})
