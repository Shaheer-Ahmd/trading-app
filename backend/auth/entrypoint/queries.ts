import { Model } from "mongoose";
import { UnitOfWork } from "../../entrypoint/uow";
import { Inventory, Trade } from "../../trading/domain/model";

const getAllTrades = async (uow: UnitOfWork) => {
  const inventoryModel: Model<Inventory> =
    uow.inventory_repo.getInventoryModel();
  let allUsers = await inventoryModel.find().exec();
  let allInventories = allUsers as Inventory[];
  let allTrades: Trade[] = [];
  allInventories.forEach((inventory) => {
    allTrades = allTrades.concat(inventory.trades);
  });
  let allTradesWithUsernames = [];
  for (let trade of allTrades) {
    let user = await uow.user_repo.get(trade.userId);
    if (!user) {
      continue;
    }
    let dict = JSON.parse(JSON.stringify(trade));
    dict["userName"] = user.fullName;
    allTradesWithUsernames.push(dict);
    // allTradesWithUsernames.push({trade, userName: user.fullName});
  }

  return allTradesWithUsernames;
};

const getAllOffers = async (
  tradeId: string,
  creatorId: string,
  uow: UnitOfWork,
) => {
  let inventory = await uow.inventory_repo.get(creatorId);
  if (!inventory) {
    return null;
  }
  let trade = inventory.trades.find((trade) => trade._id === tradeId);
  if (!trade) {
    return null;
  }
  let allOffersWithUsernames = [];
  for (let offer of trade.offers) {
    let user = await uow.user_repo.get(offer.offererId);
    if (!user) {
      continue;
    }
    let dict = JSON.parse(JSON.stringify(offer));
    dict["userName"] = user.fullName;
    allOffersWithUsernames.push(dict);
    // allTradesWithUsernames.push({trade, userName: user.fullName});
  }
  return allOffersWithUsernames;
};
export default {
  getAllTrades,
  getAllOffers,
};
