import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { BankTransferUseCase } from './BankTransferUseCase';

class BankTransferController {
  async execute(request: Request, response: Response): Promise<void> {
    const { id: sender_id } = request.user
    const { user_id: receiver_id } = request.params
    const {amount, description} = request.body


    const bankTransferUseCase = container.resolve(BankTransferUseCase)

    await bankTransferUseCase.execute({sender_id, receiver_id, amount, description})

  }
}

export { BankTransferController }
