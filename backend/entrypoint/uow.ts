// import { Connection, Schema, Mongoose} from "mongoose";
import {
  AbstractUserRepository,
  UserRepository,
} from "../auth/adapters/repository";
import {
  AbstractInventoryRepository,
  InventoryRepository,
} from "../trading/adapters/repository";
import { Model } from "mongoose";
import { User } from "../auth/domain/model";
import { Inventory } from "../trading/domain/model";

// const connStr:string = process.env.CONN_STR;
const connStr: string =
  "mongodb+srv://shaheerahmad2345:P4eCDeNijhgMEFI9@cluster0.q2byr2c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
export class AbstractUnitOfWork {
  user_repo!: AbstractUserRepository;
  inventory_repo!: AbstractInventoryRepository;

  public commit() {
    throw new Error("Not implemented");
  }

  public close() {
    throw new Error("Not implemented");
  }

  public commit_close() {
    this.commit();
    this.close();
  }
}

export class UnitOfWork extends AbstractUnitOfWork {
  public constructor() {
    super();
    this.user_repo = new UserRepository();
    this.inventory_repo = new InventoryRepository();
  }

  public commit() {}

  public close() {
    // this.connection.close();
  }

  public commit_close(): void {
    this.commit();
    this.close();
  }
}
