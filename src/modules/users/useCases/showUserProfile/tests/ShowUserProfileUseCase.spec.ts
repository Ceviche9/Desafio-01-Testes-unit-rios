import { InMemoryUsersRepository } from "../../../repositories/in-memory/InMemoryUsersRepository"
import { ShowUserProfileUseCase } from '../ShowUserProfileUseCase';


let inMemoryUsersRepository: InMemoryUsersRepository
let showUserProfileUseCase : ShowUserProfileUseCase

describe("ShowUserProfileUseCase", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
  })

  it("Should be able to show a profile by id", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Fake User",
      email: "fake@email.com",
      password: "123456"
    })

    const userProfile = await showUserProfileUseCase.execute(user.id)

    expect(userProfile).toHaveProperty("name")
    expect(userProfile).toHaveProperty("email")
    expect(userProfile.email).toEqual("fake@email.com")
  })
})
