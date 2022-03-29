import { AppError } from '../../../../../shared/errors/AppError';
import { InMemoryUsersRepository } from '../../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from '../../../repositories/in-memory/InMemoryStatementsRepository';
import { GetBalanceUseCase } from '../GetBalanceUseCase';

let getBalanceUseCase: GetBalanceUseCase
let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository

describe("GetBalanceUseCase", () => {

  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    )
  })

  it("Should be able to get a users balance", async() => {
    const user = await inMemoryUsersRepository.create({
      name: "Fake User",
      email: "fake@email.com",
      password: "123456"
    })

    enum OperationType {
      DEPOSIT = 'deposit',
      WITHDRAW = 'withdraw',
    }

    await inMemoryStatementsRepository.create({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "FAKE-DEPOSIT"
    })

    await inMemoryStatementsRepository.create({
      user_id: user.id,
      type: OperationType.WITHDRAW,
      amount: 250,
      description: "FAKE-DEPOSIT"
    })

    const balance = await getBalanceUseCase.execute({user_id: user.id})

    expect(balance.balance).toEqual(750)
  })

  it("Should not be able to get balance for a non registered user", async() => {
    expect(async() => {
      enum OperationType {
        DEPOSIT = 'deposit',
        WITHDRAW = 'withdraw',
      }

      await inMemoryStatementsRepository.create({
        user_id: "FAKE-USER-ID",
        type: OperationType.DEPOSIT,
        amount: 1000,
        description: "FAKE-DEPOSIT"
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})
