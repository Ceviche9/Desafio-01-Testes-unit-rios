import { AppError } from "../../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from '../AuthenticateUserUseCase';

let inMemoryUsersRepository: InMemoryUsersRepository
let authenticateUserUseCase : AuthenticateUserUseCase

describe("Authenticate User", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
  })

  it("Should be able to authenticate a user", async() => {
    await inMemoryUsersRepository.create({
      name: "Fake User",
      email: "fake@email.com",
      password: "test"
    })

    const {user, token} = await authenticateUserUseCase.execute({
      email: "fake@email.com",
      password: "test"
    })

    expect(user).toHaveProperty("email")
    expect(user.email).toEqual("fake@email.com")
    expect(token).not.toBeUndefined()
  })


  it("Should not be able to authenticate a user with wrong credentials", async() => {
    expect(async () => {
      await inMemoryUsersRepository.create({
        name: "Fake User",
        email: "fake@email.com",
        password: "test"
      })

      await authenticateUserUseCase.execute({
        email: "wrong@email.com",
        password: "test"
      })

    }).rejects.toBeInstanceOf(AppError)
  })
})
