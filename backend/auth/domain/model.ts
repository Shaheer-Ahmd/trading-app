import { UUID } from "mongodb";
import { InvalidPassword } from "./exceptions";

class User {
  _id: string;
  fullName: string;
  userName: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;

  public constructor(
    id: string,
    fullName: string,
    userName: string,
    password: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    this._id = id;
    this.fullName = fullName;
    this.userName = userName;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public verifyPassword(password: string) {
    if (this.password !== password) {
      throw new InvalidPassword();
    }
  }

  public changePassword(oldPassword: string, newPassword: string) {
    this.verifyPassword(oldPassword);
    this.setPassword(newPassword);
  }

  public setPassword(password: string) {
    this.password = password;
    this.updatedAt = new Date();
  }
}

export { User };
