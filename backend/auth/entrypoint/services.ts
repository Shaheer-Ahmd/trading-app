import { AbstractUnitOfWork } from "../../entrypoint/uow";
import { User } from "../domain/model";

async function validatePassword(
  userName: string,
  password: string,
  uow: AbstractUnitOfWork,
): Promise<boolean> {
  // Get the user from the repository
  const user: User | null = await uow.user_repo.getByUserName(userName);

  // Check if the user exists
  if (!user) {
    return false;
  }
  // console.log(User.prototype.verifyPassword);
  user.verifyPassword(password);
  return true;
}

export default {
  validatePassword,
};
