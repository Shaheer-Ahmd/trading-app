import { UUID } from "mongodb";
import { AbstractUnitOfWork } from "../../entrypoint/uow";
import { User } from "../domain/model";
import { UserAlreadyExists } from "./exceptions";

async function createUser(
  id: string,
  fullName: string,
  userName: string,
  password: string,
  createdAt: Date,
  updatedAt: Date,
  uow: AbstractUnitOfWork,
): Promise<void> {
  const u = await uow.user_repo.getByUserName(userName);
  if (u) {
    throw new UserAlreadyExists(
      `User with username ${userName} already exists`,
    );
  }
  const user = new User(id, fullName, userName, password, createdAt, updatedAt);

  uow.user_repo.save(user);
}

const changePassword = async (
  uid: string,
  oldPassword: string,
  newPassword: string,
  uow: AbstractUnitOfWork,
): Promise<void> => {
  const user = await uow.user_repo.get(uid);
  if (!user) {
    return;
  }
  user.changePassword(oldPassword, newPassword);
  uow.user_repo.save(user);
};

export default {
  createUser,
  changePassword,
};
