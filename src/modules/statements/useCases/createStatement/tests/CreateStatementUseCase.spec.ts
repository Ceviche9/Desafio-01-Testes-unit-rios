import { AppError } from '../../../../../shared/errors/AppError';
import { InMemoryUsersRepository } from '../../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from '../../../repositories/in-memory/InMemoryStatementsRepository';
import { CreateStatementUseCase } from '../CreateStatementUseCase';

let createStatementUseCase: CreateStatementUseCase
let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository

describe("CreateStatementUseCase", () => {

  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    )
  })

  it("Should be able to create a new statement for a user", async() => {
    const user  = await inMemoryUsersRepository.create({
      name: "Fake User",
      email: "fake@email.com",
      password: "123456"
    })

    enum OperationType {
      DEPOSIT = 'deposit',
      WITHDRAW = 'withdraw',
    }

    const statementOperation = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "FAKE-DEPOSIT"
    })

    expect(statementOperation).toHaveProperty("id")
    expect(statementOperation.user_id).toEqual(user.id)
    expect(statementOperation.type).toEqual('deposit')
    expect(statementOperation.amount).toEqual(1000)

  })

  it("Should be able to make a withdraw for a user", async() => {
    const user  = await inMemoryUsersRepository.create({
      name: "Fake User",
      email: "fake@email.com",
      password: "123456"
    })

    enum OperationType {
      DEPOSIT = 'deposit',
      WITHDRAW = 'withdraw',
    }

    await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "FAKE-DEPOSIT"
    })

    const statementOperation = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.WITHDRAW,
      amount: 500,
      description: "FAKE-DEPOSIT"
    })

    expect(statementOperation).toHaveProperty("id")
    expect(statementOperation.user_id).toEqual(user.id)
    expect(statementOperation.type).toEqual('withdraw')
    expect(statementOperation.amount).toEqual(500)
  })

  it("Should not be able to make a withdraw for a user without cash", async() => {
    expect(async () => {
      const user_id = "FAKE"

      enum OperationType {
        DEPOSIT = 'deposit',
        WITHDRAW = 'withdraw',
      }

      await createStatementUseCase.execute({
        user_id,
        type: OperationType.WITHDRAW,
        amount: 1000,
        description: "FAKE-DEPOSIT"
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it("Should not be able to create a new statement for a non registered user", async() => {
    expect(async () => {
      const user_id = "FAKE"

      enum OperationType {
        DEPOSIT = 'deposit',
        WITHDRAW = 'withdraw',
      }

      await createStatementUseCase.execute({
        user_id,
        type: OperationType.DEPOSIT,
        amount: 1000,
        description: "FAKE-DEPOSIT"
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})
