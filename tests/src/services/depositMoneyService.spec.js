const { sequelize } = require('../../../src/model')
const DepositMoneyService = require('../../../src/services/depositMoneyService')
const { Profile, Contract, Job } = sequelize.models

describe('DepositMoneyService', () => {
  it('deposits money', async () => {
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

    const client2 = await Profile.create({
      firstName: 'Johnny',
      lastName: 'Doe',
      profession: 'Developer',
      balance: 0,
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

    await DepositMoneyService.call(
      { amount: 100, originProfileId: client.id, destinationProfileId: client2.id }
    )

    await client.reload()
    await client2.reload()

    expect(client.balance).toEqual(900)
    expect(client2.balance).toEqual(100)
  })

  it('doesnt deposit money for more than 25% of total jobs to pay', async () => {
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

    const client2 = await Profile.create({
      firstName: 'Johnny',
      lastName: 'Doe',
      profession: 'Developer',
      balance: 0,
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

    const contract2 = await Contract.create({
      terms: 'this is a term',
      status: 'in_progress',
      ClientId: client.id,
      ContractorId: contractor.id
    })

    const job = await Job.create({
      description: 'development work',
      price: 500,
      ContractId: contract.id
    })

    const job2 = await Job.create({
      description: 'development work',
      price: 500,
      ContractId: contract2.id
    })

    await DepositMoneyService.call(
      { amount: 1300, originProfileId: client.id, destinationProfileId: client2.id }
    )

    await client.reload()
    await client2.reload()

    expect(client.balance).toEqual(1000)
    expect(client2.balance).toEqual(0)
  })
})
