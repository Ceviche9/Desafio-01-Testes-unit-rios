import { AppError } from "../../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../CreateUserUseCase"


let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe("CreateUserUseCase", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it("Should be able to create a new user", async() => {
    const user = await createUserUseCase.execute({
      name: "Fake User",
      email: "fake@email.com",
      password: "123456"
    })

    expect(user).toHaveProperty("id")
    expect(user.email).toEqual("fake@email.com")
  })

  it("Should not be able to create a new user with a email already registered", async() => {
    expect(async() => {
      await createUserUseCase.execute({
        name: "Fake User",
        email: "fake@email.com",
        password: "123456"
      })

      await createUserUseCase.execute({
        name: "Fake User",
        email: "fake@email.com",
        password: "123456"
      })

    }).rejects.toBeInstanceOf(AppError)
  })
})
