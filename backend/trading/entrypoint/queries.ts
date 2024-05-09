import { UnitOfWork } from "../../entrypoint/uow";
import { Inventory } from "../domain/model";

const getInventoryFromTradeId = async (
  tradeId: string,
  uow: UnitOfWork,
): Promise<Inventory | null> => {
  const inventory = await uow.inventory_repo
    .getInventoryModel()
    .findOne({ "trades._id": tradeId })
    .exec();
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
};

export default {
  getInventoryFromTradeId,
};
