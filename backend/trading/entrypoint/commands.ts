import { UUID } from "mongodb";
import { AbstractUnitOfWork } from "../../entrypoint/uow";
import { Inventory, Item } from "../domain/model";
import trd_qry from "./queries";

const initializeInventory = async (userId: string, uow: AbstractUnitOfWork) => {
  const inventory = new Inventory(userId);
  inventory.cash = 1000;
  uow.inventory_repo.save(inventory);
};

const addItem = async (
  userId: string,
  id: string,
  name: string,
  description: string,
  price: number,
  uow: AbstractUnitOfWork,
) => {
  const item = new Item(id, name, description, price);
  const inventory = await uow.inventory_repo.get(userId);
  if (!inventory) {
    return;
  }
  inventory.addItem(item);
  uow.inventory_repo.save(inventory);
};

const createTrade = async (
  userId: string,
  id: string,
  itemIds: string[],
  uow: AbstractUnitOfWork,
  conditions: string[],
) => {
  const inventory = await uow.inventory_repo.get(userId);
  if (!inventory) {
    return;
  }
  inventory.createTrade(id, itemIds, conditions);
  uow.inventory_repo.save(inventory);
};

const createOffer = async (
  tradeId: string,
  itemIds: string[],
  offererId: string,
  uow: AbstractUnitOfWork,
  price: number,
) => {
  const inventory = await trd_qry.getInventoryFromTradeId(tradeId, uow);
  if (!inventory) {
    return;
  }

  const offererInventory = await uow.inventory_repo.get(offererId);
  if (!offererInventory) {
    return;
  }

  const items = offererInventory.items.filter((item) =>
    itemIds.includes(item._id),
  );

  const offerID = new UUID().toString();
  inventory.createOffer(offerID, tradeId, items, offererId, price);
  offererInventory.createOfferOffererSide(offerID, items, price);
  uow.inventory_repo.save(inventory);
  uow.inventory_repo.save(offererInventory);
};

const acceptOffer = async (
  userId: string,
  tradeId: string,
  offerId: string,
  offererId: string,
  uow: AbstractUnitOfWork,
) => {
  const inventory = await uow.inventory_repo.get(userId);
  if (!inventory) {
    return;
  }
  const inventoryOfferer = await uow.inventory_repo.get(offererId);
  if (!inventoryOfferer) {
    return;
  }

  const trade = inventory.trades.find((trade) => trade._id === tradeId);
  if (!trade) {
    return;
  }
  const otherOffers = trade.offers.filter((offer) => offer._id !== offerId);
  const tradedItems = trade.items;
  inventory.acceptOffer(tradeId, offerId);
  inventoryOfferer.acceptOfferOffererSide(tradedItems, offerId);

  await uow.inventory_repo.save(inventory);
  await uow.inventory_repo.save(inventoryOfferer);

  console.log("other offers", otherOffers);
  // reject the remaining offers on that trade
  for (let offer of otherOffers) {
    uow.inventory_repo
      .get(offer.offererId)
      .then((inv) => {
        if (!inv) {
          return;
        }
        inv.rejectOfferOffererSide(offer._id);
        uow.inventory_repo.save(inv);
      })
      .catch((err) => {
        console.log("error rejecting offerer side of offer");
      });
  }
  // otherOffers.forEach(offer => async () => {
  // });
};

const rejectOffer = async (
  uid: string,
  tradeId: string,
  offerId: string,
  offererId: string,
  uow: AbstractUnitOfWork,
) => {
  const inventory = await uow.inventory_repo.get(uid);
  if (!inventory) {
    return;
  }
  const offererInventory = await uow.inventory_repo.get(offererId);
  if (!offererInventory) {
    return;
  }

  inventory.rejectOffer(tradeId, offerId);
  offererInventory.rejectOfferOffererSide(offerId);
  uow.inventory_repo.save(inventory);
  uow.inventory_repo.save(offererInventory);
};

export default {
  initializeInventory,
  addItem,
  createTrade,
  createOffer,
  acceptOffer,
  rejectOffer,
};
