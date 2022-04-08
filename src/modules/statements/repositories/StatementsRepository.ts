import { getRepository, Repository } from "typeorm";

import { Statement } from "../entities/Statement";
import { IBankTransferDTO } from "../useCases/bankTransfer/IBankTransferDTO";
import { ICreateStatementDTO } from "../useCases/createStatement/ICreateStatementDTO";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../useCases/getStatementOperation/IGetStatementOperationDTO";
import { IStatementsRepository } from "./IStatementsRepository";

export class StatementsRepository implements IStatementsRepository {
  private repository: Repository<Statement>;

  constructor() {
    this.repository = getRepository(Statement);
  }

  async create({
    user_id,
    amount,
    description,
    type
  }: ICreateStatementDTO): Promise<Statement> {
    const statement = this.repository.create({
      user_id,
      amount,
      description,
      type
    });

    return this.repository.save(statement);
  }

  async findStatementOperation({ statement_id, user_id }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.repository.findOne(statement_id, {
      where: { user_id }
    });
  }

  async getUserBalance({ user_id, with_statement = false }: IGetBalanceDTO):
    Promise<
      { balance: number } | { balance: number, statement: Statement[] }
    >
  {
    const statement = await this.repository.find({
      where: { user_id }
    });

    const balance = statement.reduce((acc, operation) => {
      if (operation.type === 'deposit' || operation.type === 'transfer') {
        return acc + operation.amount;
      } else {
        return acc - operation.amount;
      }
    }, 0)

    if (with_statement) {
      return {
        statement,
        balance
      }
    }

    return { balance }
  }

  async bankTransfer({sender_id, receiver_id, amount, description}: IBankTransferDTO): Promise<Statement[]> {
    enum OperationType {
      DEPOSIT = 'deposit',
      WITHDRAW = 'withdraw',
      TRANSFER = 'transfer'
    }

    const senderStatement = this.repository.create({
      user_id: sender_id,
      description,
      type: OperationType.TRANSFER,
      amount: - amount
    })

    const receiverStatement = this.repository.create({
      user_id: receiver_id,
      description,
      type: OperationType.TRANSFER,
      amount: amount
    })

    await this.repository.save(senderStatement)
    await this.repository.save(receiverStatement)


    return [senderStatement, receiverStatement]
  };
}
