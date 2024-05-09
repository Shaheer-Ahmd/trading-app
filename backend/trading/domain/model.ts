import { InvalidItem, InvalidOffer, InvalidTrade } from "./exceptions";
class Item {
  constructor(
    public _id: string,
    public name: string,
    public description: string,
    public price: number,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}
}

export enum OfferStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

class Offer {
  constructor(
    public _id: string,
    public offererId: string,
    public items: Array<Item>,
    public createdAt: Date = new Date(),
    public status: OfferStatus,
    public price: number = 0,
  ) {}
}

export enum TradeStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
}

class Trade {
  constructor(
    public _id: string,
    public userId: string,
    public items: Array<Item>,
    public offers: Array<Offer>,
    public status: TradeStatus,
    public createdAt: Date = new Date(),
    public conditions: Array<string> = [],
  ) {}

  createOffer(offer: Offer) {
    this.offers.push(offer);
  }

  completeTrade() {
    if (this.status === TradeStatus.PENDING) {
      this.status = TradeStatus.COMPLETED;
    }
  }
}

class Inventory {
  /*
    Inventory aggregate root
    Entites contained:
    - Item
    - Trade
        Each trade contains offers
    */
  constructor(
    public _id: string, // this ID is the same as the user ID
    public items: Array<Item> = [],
    public trades: Array<Trade> = Array<Trade>(),
    public offersGiven: Array<Offer> = Array<Offer>(),
    public updatedAt: Date = new Date(),
    public cash: number = 0,
  ) {}

  addItem(item: Item) {
    if(item.price <= 0) {
      throw new InvalidItem("Item price must be greater than 0");
    }
    this.items.push(item);
    this.updatedAt = new Date();
  }

  createTrade(id: string, itemIds: string[], conditions: string[] = []) {
    if(itemIds.length === 0) {
      throw new InvalidTrade("Trade must contain at least one item");
    }
    
    const items: Item[] = this.items.filter((item) =>
      itemIds.includes(item._id),
    );
    const trade = new Trade(
      id,
      this._id,
      items,
      [],
      TradeStatus.PENDING,
      new Date(),
      conditions,
    );
    this.trades.push(trade);
    this.updatedAt = new Date();
  }

  createOffer(
    offerId: string,
    tradeId: string,
    items: Item[],
    offererId: string,
    price: number = 0,
  ) {
    if (items.length === 0 && price === 0) {
      throw new InvalidOffer("Offer must contain at least one item or non zero price");
    }
    if (price < 0) {
      throw new InvalidOffer("Offer price must not be negative");
    }
    const trade = this.trades.find((trade) => trade._id === tradeId);
    if (!trade) {
      return;
    }
    // const items = this.items.filter(item => itemIds.includes(item._id));
    const offer = new Offer(
      offerId,
      offererId,
      items,
      new Date(),
      OfferStatus.PENDING,
      price,
    );
    // trade.createOffer(offer);
    trade.offers.push(offer);

    this.trades = this.trades.map((trd) => {
      if (trd._id === tradeId) {
        return trade;
      }
      return trd;
    });

    this.updatedAt = new Date();
  }

  createOfferOffererSide(offerId: string, items: Item[], price: number = 0) {
    const offer = new Offer(
      offerId,
      this._id,
      items,
      new Date(),
      OfferStatus.PENDING,
      price,
    );
    // console.log(offer);
    // console.log(this.offersGiven);

    this.offersGiven.push(offer);

    // console.log(typeof this.offersGiven);

    // this.offersGiven = [...this.offersGiven, offer];
    this.updatedAt = new Date();
  }

  acceptOffer(tradeId: string, offerId: string) {
    const trade = this.trades.find((trade) => trade._id === tradeId);
    if (!trade) {
      return;
    }
    const offer = trade.offers.find((offer) => offer._id === offerId);
    if (!offer) {
      return;
    }
    offer.status = OfferStatus.ACCEPTED;
    // trade.completeTrade();
    trade.status = TradeStatus.COMPLETED;
    console.log("previous items", this.items);
    const tradeItemIds = trade.items.map((item) => item._id);
    this.items = this.items.filter((item) => !tradeItemIds.includes(item._id));

    console.log("new items", this.items);
    this.cash += offer.price;
    this.items.push(...offer.items);
    // console.log("trade items", trade.items);
    // this.items = this.items.filter(item => !trade.items.includes(item));
    // this.items = this.items.filter(item => trade.items.includes(item));
    // let newItems = []
    // for(let i = 0; i < this.items.length; i++) {
    //     console.log("item", this.items[i]);
    //     console.log("trade.items.includes(this.items[i]): ", trade.items.includes(this.items[i]));

    //     if (!trade.items.includes(this.items[i])) {
    //         newItems.push(this.items[i]);
    //     }

    // }
    // this.items = newItems;
    trade.offers = trade.offers.map((ofr) => {
      if (ofr._id === offerId) {
        return offer;
      }
      return ofr;
    });

    this.trades = this.trades.map((trd) => {
      if (trd._id === tradeId) {
        return trade;
      }
      return trd;
    });

    // clean all occurences of tradedItems from inventory
    this._filterItems(tradeItemIds);

    this.updatedAt = new Date();
  }

  _filterItems(itemIds: string[]) {
    // remove all trades that include any of the traded items
    this.trades = this.trades.filter((trade) => {
      return !trade.items.some((item) => itemIds.includes(item._id));
    });

    // remove all offers that include any of the traded items
    this.offersGiven = this.offersGiven.filter((offer) => {
      return !offer.items.some((item) => itemIds.includes(item._id));
    });
  }

  acceptOfferOffererSide(tradedItems: Item[], offerId: string) {
    const offer = this.offersGiven.find((offer) => offer._id === offerId);
    if (!offer) {
      return;
    }
    offer.status = OfferStatus.ACCEPTED;
    const itemIds = offer.items.map((item) => item._id);
    this.items = this.items.filter((item) => !itemIds.includes(item._id));
    this.cash -= offer.price;
    // this.items = this.items.filter(item => !offer.items.includes(item));
    this.items.push(...tradedItems);
    this._filterItems(itemIds);
    this.updatedAt = new Date();
  }

  rejectOffer(tradeId: string, offerId: string) {
    const trade = this.trades.find((trade) => trade._id === tradeId);
    if (!trade) {
      return;
    }
    trade.offers = trade.offers.filter((offer) => offer._id !== offerId);
    this.trades = this.trades.map((trd) => {
      if (trd._id === tradeId) {
        return trade;
      }
      return trd;
    });
    this.updatedAt = new Date();
  }

  rejectOfferOffererSide(offerId: string) {
    this.offersGiven = this.offersGiven.filter(
      (offer) => offer._id !== offerId,
    );
    this.updatedAt = new Date();
  }
}

export { Inventory, Item, Offer, Trade };

