import ApplicationError from "@application/common/application-error";
import { IUserRepository } from "@application/repositories/user-repository";
import { UpdateProfile } from "@domain/use-cases";

export class UpdateProfileUseCase implements UpdateProfile.UseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(params: UpdateProfile.Params): Promise<UpdateProfile.Result> {
    const { userId, firstName, lastName, avatar } = params;

    const oldUser = await this.userRepo.getById(userId);

    if (!oldUser.isVerified) {
      throw new ApplicationError("Email not verified.", "EMAIL_NOT_VERIFIED");
    }

    if (!oldUser) {
      throw new ApplicationError("User not found", "USER_NOT_FOUND");
    }

    oldUser.profile = {
      firstName,
      lastName,
      avatar,
    };

    const updated = await this.userRepo.update(oldUser.id, oldUser);

    if (!updated) {
      throw new ApplicationError("User not updated", "USER_NOT_UPDATED");
    }

    return true;
  }
}
