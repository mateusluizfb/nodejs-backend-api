const { sequelize } = require('../../../src/model')
const FindNonTerminatedContractsService = require('../../../src/services/findNonTerminatedContractsService')
const { Profile, Contract, Job } = sequelize.models

describe('FindNonTerminatedContractsService', () => {
  it('finds non terminated contract', async () => {
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

    const contract2 = await Contract.create({
      terms: 'this is a term',
      status: 'in_progress',
      ClientId: client.id,
      ContractorId: contractor.id
    })

    const contractsRequested = await FindNonTerminatedContractsService.call({ profile_id: client.id })

    expect(contractsRequested[0].id).toEqual(contract.id)
    expect(contractsRequested[1].id).toEqual(contract2.id)
  })

  it('doesnt return terminated contract', async () => {
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
      status: 'terminated',
      ClientId: client.id,
      ContractorId: contractor.id
    })

    const contractsRequested = await FindNonTerminatedContractsService.call({ profile_id: client.id })

    expect(contractsRequested.length).toEqual(0)
  })
})
