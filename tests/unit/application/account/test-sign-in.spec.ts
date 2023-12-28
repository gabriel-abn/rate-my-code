import ApplicationError from "@application/common/application-error";
import SignInUseCase from "@application/use-cases/sign-in-use-case";
import SignIn from "@domain/use-cases/sign-in";
import UserRepositorySpy from "tests/mocks/repositories/user-repository-spy";
import { Mock } from "vitest";

describe("Sign In Use Case", () => {
  let userRepo: UserRepositorySpy;
  let sendEmailConfirmation: { send: Mock };
  let hasher: { hash: Mock; compare: Mock };
  let tokenRepo: { saveToken: Mock };
  let encrypter: { encrypt: Mock };

  let sut: SignIn.UseCase;

  let fakeData: SignIn.Params;

  beforeEach(() => {
    userRepo = new UserRepositorySpy();

    hasher = {
      hash: vi.fn(),
      compare: vi.fn(),
    };

    encrypter = {
      encrypt: vi.fn(),
    };

    tokenRepo = {
      saveToken: vi.fn(),
    };

    sendEmailConfirmation = {
      send: vi.fn(),
    };

    sut = new SignInUseCase(
      userRepo,
      hasher,
      encrypter,
      tokenRepo,
      sendEmailConfirmation,
    );

    fakeData = {
      email: "gabriel@gmail.com",
      password: "Fake123!",
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should throw error if email already exists", () => {
    expect(
      async () =>
        await sut.execute({
          email: "fake@gmail.com",
          password: "Fake123!",
        }),
    ).rejects.toThrowError(ApplicationError);
  });

  it("should send email confirmation", async () => {
    sendEmailConfirmation.send.mockResolvedValueOnce(true);

    await sut.execute(fakeData);

    expect(sendEmailConfirmation.send).toHaveBeenCalledWith({
      to: fakeData.email,
      template: "email-confirmation",
      data: {
        token: expect.any(String),
      },
    });
  });

  it("should save varification token", async () => {
    sendEmailConfirmation.send.mockResolvedValueOnce(true);

    await sut.execute(fakeData);

    expect(tokenRepo.saveToken).toHaveBeenCalledWith(fakeData.email, expect.any(String));
  });

  it("should encrypt password", async () => {
    sendEmailConfirmation.send.mockResolvedValueOnce(true);
    tokenRepo.saveToken.mockResolvedValueOnce(true);

    await sut.execute(fakeData);

    expect(hasher.hash).toHaveBeenCalledWith(fakeData.password);
  });

  it("should save user in database", async () => {
    sendEmailConfirmation.send.mockResolvedValueOnce(true);
    tokenRepo.saveToken.mockResolvedValueOnce(true);
    hasher.hash.mockResolvedValueOnce("hashed-password");

    const spy = vi.spyOn(userRepo, "save");

    await sut.execute(fakeData);

    expect(spy).toHaveBeenCalledOnce();
  });

  it("should return an access token", async () => {
    sendEmailConfirmation.send.mockResolvedValueOnce(true);
    tokenRepo.saveToken.mockResolvedValueOnce(true);
    hasher.hash.mockResolvedValueOnce("hashed-password");
    encrypter.encrypt.mockResolvedValueOnce("fake-access-token");

    const result = await sut.execute(fakeData);

    expect(result.accessToken).toBe("fake-access-token");
  });
});
