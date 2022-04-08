import { InMemoryUsersRepository } from '../../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from '../../../repositories/in-memory/InMemoryStatementsRepository';
import { BankTransferError } from '../BankTransferError';
import { BankTransferUseCase } from '../BankTransferUseCase';

let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let bankTransferUseCase: BankTransferUseCase


describe("Bank Transfer", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    bankTransferUseCase = new BankTransferUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    )
  })


  it("Should not be able to transfer amounts exceeding the available balance in an account", async () => {
    const receiver = await inMemoryUsersRepository.create({
      name: "Fake-User-Receiver",
      email: "receiver@email.com",
      password: "123456"
    })

    const sender = await inMemoryUsersRepository.create({
      name: "Fake-User-Sender",
      email: "sender@email.com",
      password: "123456"
    })

    enum OperationType {
      DEPOSIT = 'deposit',
      WITHDRAW = 'withdraw',
    }

    await inMemoryStatementsRepository.create({
      user_id: sender.id,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "FAKE-DEPOSIT"
    })

    await inMemoryStatementsRepository.create({
      user_id: receiver.id,
      type: OperationType.DEPOSIT,
      amount: 0,
      description: "FAKE-DEPOSIT"
    })

    expect(async () => {
      await bankTransferUseCase.execute({
        sender_id: sender.id,
        receiver_id: receiver.id,
        amount: 2000,
        description: "TEST"
      })
    }).rejects.toEqual(new BankTransferError.InsufficientFunds())
  })


  it("Should be able to show the balance of a user, with the transfer field", async() => {
    const receiver = await inMemoryUsersRepository.create({
      name: "Fake-User-Receiver",
      email: "receiver@email.com",
      password: "123456"
    })

    const sender = await inMemoryUsersRepository.create({
      name: "Fake-User-Sender",
      email: "sender@email.com",
      password: "123456"
    })

    enum OperationType {
      DEPOSIT = 'deposit',
      WITHDRAW = 'withdraw',
    }

    await inMemoryStatementsRepository.create({
      user_id: sender.id,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "FAKE-DEPOSIT"
    })

    await inMemoryStatementsRepository.create({
      user_id: receiver.id,
      type: OperationType.DEPOSIT,
      amount: 0,
      description: "FAKE-DEPOSIT"
    })


    await bankTransferUseCase.execute({
      sender_id: sender.id,
      receiver_id: receiver.id,
      amount: 500,
      description: "TEST"
    })


    const balance = await inMemoryStatementsRepository.getUserBalance({
      user_id: sender.id,
      with_statement: true
    })

    const balance2 = await inMemoryStatementsRepository.getUserBalance({
      user_id: receiver.id,
      with_statement: true
    })

    console.log(balance)
    console.log(balance2)

  })
})
