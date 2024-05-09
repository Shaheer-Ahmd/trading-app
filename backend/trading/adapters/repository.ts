import { Inventory, Offer, Trade } from "../domain/model";
import { Schema, Model, model } from "mongoose";
import { Dictionary } from "lodash";
import { ItemSchema, OfferSchema, TradeSchema } from "./schemas";

class AbstractInventoryRepository {
  inventoryModel!: Model<Inventory> | any;
  // public tradeModel!: Model<TradeSchema> | any;
  // public offerModel!: Model<OfferSchema> | any;
  // public itemModel!: Model<ItemSchema> | any;

  async save(inventory: Inventory): Promise<void> {
    throw new Error("Not implemented");
  }

  async get(userId: string): Promise<Inventory | null> {
    throw new Error("Not implemented");
  }

  public getInventoryModel(): Model<Inventory> | any {
    throw new Error("Not implemented");
  }
}

class InventoryRepository extends AbstractInventoryRepository {
  public constructor() {
    super();
    const inventorySchema = new Schema({
      _id: String, // This is the user id
      updatedAt: Date,
      items: Object,
      trades: Object,
      offersGiven: Object,
      cash: Number,
    });

    try {
      this.inventoryModel = model("Inventory");
    } catch (e) {
      this.inventoryModel = model<Inventory>("Inventory", inventorySchema);
    }
  }

  async save(inventory: Inventory): Promise<void> {
    const alreadyExists = await this.inventoryModel
      .exists({ _id: inventory._id })
      .exec();
    if (alreadyExists) {
      await this.inventoryModel
        .updateOne({ _id: inventory._id }, inventory)
        .exec();
      return;
    }

    await this.inventoryModel.create(inventory);
  }

  async get(userId: string): Promise<Inventory | null> {
    const inventory = await this.inventoryModel.findOne({ _id: userId }).exec();
    if (!inventory) {
      return null;
    }

    return new Inventory(
      inventory._id,
      inventory.items,
      inventory.trades,
      inventory.offersGiven,
      inventory.updatedAt,
      inventory.cash,
    );
  }

  public getInventoryModel(): Model<Inventory> | any {
    return this.inventoryModel;
  }
}

export { AbstractInventoryRepository, InventoryRepository };
