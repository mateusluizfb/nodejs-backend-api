const { sequelize } = require('../../../src/model')
const FindBestProfessionService = require('../../../src/services/findBestProfessionService')
const { Profile, Contract, Job } = sequelize.models

describe('FindBestProfessionService', () => {
  it('returns best profession paid', async () => {
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

    const result = await FindBestProfessionService.call({ startDate, endDate })

    expect(result).toEqual('Developer')
  })

  it('returns null for date range without paid jobs', async () => {
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

    const contractor2 = await Profile.create({
      firstName: 'Johnny',
      lastName: 'Doe',
      profession: 'Designer',
      balance: 1000,
      type: 'contractor'
    })

    const contract2 = await Contract.create({
      terms: 'this is a term',
      status: 'in_progress',
      ClientId: client.id,
      ContractorId: contractor2.id
    })

    const job = await Job.create({
      description: 'development work',
      price: 200,
      ContractId: contract.id,
      paid: true,
      paymentDate: new Date("2021-01-10 00:00:00")
    })

    const job2 = await Job.create({
      description: 'development work',
      price: 1000,
      ContractId: contract2.id,
      paid: true,
      paymentDate: new Date("2021-01-10 00:00:00")
    })

    const startDate = new Date("2021-01-01 00:00:00");
    const endDate = new Date("2021-01-30 00:00:00");

    const result = await FindBestProfessionService.call({ startDate, endDate })

    expect(result).toEqual('Designer')
  })

  it('returns best profession paid', async () => {
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

    const result = await FindBestProfessionService.call({ startDate, endDate })

    expect(result).toEqual(null)
  })
})
