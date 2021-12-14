const { sequelize } = require('../../../src/model')
const FindContractService = require('../../../src/services/findContractService')
const { Profile, Contract, Job } = sequelize.models

describe('FindContractService', () => {
  it('finds a contract', async () => {
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

    const contractRequested = await FindContractService.call({ id: contract.id, profile_id: client.id })

    expect(contractRequested.id).toEqual(contract.id)
  })
})
