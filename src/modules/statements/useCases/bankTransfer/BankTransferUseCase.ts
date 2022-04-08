import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { BankTransferError } from "./BankTransferError";

interface IRequest {
  sender_id: string;
  receiver_id: string
  amount: number
  description: string
}

@injectable()
class BankTransferUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({sender_id, receiver_id, amount, description}: IRequest): Promise<Statement[]> {
    const sender = await this.usersRepository.findById(sender_id);
    const receiver = await this.usersRepository.findById(receiver_id);

    if(!sender || !receiver) {
      throw new BankTransferError.UserNotFound()
    }

    const senderBalance = await this.statementsRepository.getUserBalance({user_id: sender_id})

    if(senderBalance.balance < amount) {
      throw new BankTransferError.InsufficientFunds()
    }

    const transfer = await this.statementsRepository.bankTransfer({
      sender_id,
      receiver_id,
      amount,
      description
    })


    return transfer
  }
}

export { BankTransferUseCase }
