import { AppError } from '../../../../../shared/errors/AppError';
import { InMemoryUsersRepository } from '../../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from '../../../repositories/in-memory/InMemoryStatementsRepository';
import { GetStatementOperationUseCase } from '../GetStatementOperationUseCase';

let getStatementOperationUseCase: GetStatementOperationUseCase
let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository



describe("GetStatementOperationUseCase", () => {

  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    )
  })

  it("Should be able to show the users statement operation", async() => {
    const user = await inMemoryUsersRepository.create({
      name: "Fake User",
      email: "fake@email.com",
      password: "123456"
    })

    enum OperationType {
      DEPOSIT = 'deposit',
      WITHDRAW = 'withdraw',
    }

    const statement = await inMemoryStatementsRepository.create({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "FAKE-DEPOSIT"
    })

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statement.id
    })


    expect(statementOperation.amount).toEqual(1000)
  })
})
