import { User } from "../domain/model";
import { Connection, Schema, model, Model } from "mongoose";
import UserDoesNotExist from "./exceptions";

export class AbstractUserRepository {
  async save(user: User): Promise<void> {
    throw new Error("Not implemented");
  }

  async get(id: string): Promise<User | null> {
    throw new Error("Not implemented");
  }

  async getByUserName(userName: string): Promise<User | null> {
    throw new Error("Not implemented");
  }
}

export class UserRepository extends AbstractUserRepository {
  // connection: Connection;
  userModel!: Model<User> | any;
  public constructor() {
    super();
    // this.connection = connection;

    const userSchema = new Schema({
      _id: String,
      fullName: String,
      userName: String,
      password: String,
      createdAt: Date,
      updatedAt: Date,
    });

    try {
      this.userModel = model("User");
    } catch (e) {
      this.userModel = model<User>("User", userSchema);
    }
  }

  async save(user: User): Promise<void> {
    // Create a new instance of the Mongoose model and save it
    const alreadyExists = await this.userModel
      .exists({ userName: user.userName })
      .exec();
    if (alreadyExists) {
      // update
      user._id = alreadyExists._id;
      await this.userModel.updateOne({ userName: user.userName }, user).exec();
      return;
    }

    await this.userModel.create(user);
  }

  async get(id: string): Promise<User | null> {
    // Use the Mongoose model to find the user
    const user = await this.userModel.findOne({ _id: id }).exec();
    if (!user) {
      throw new UserDoesNotExist(`User does not exist`);
    }
    // cast document to object

    return new User(
      user._id,
      user.fullName,
      user.userName,
      user.password,
      user.createdAt,
      user.updatedAt,
    );
  }

  public getUserModel(): Model<User> | any {
    return this.userModel;
  }

  async getByUserName(userName: string): Promise<User | null> {
    const user = await this.userModel.findOne({ userName: userName }).exec();
    if (!user) {
      return null;
    }

    return new User(
      user._id,
      user.fullName,
      user.userName,
      user.password,
      user.createdAt,
      user.updatedAt,
    );
  }
}
