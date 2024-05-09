import { Schema } from "mongoose";
import { Item, Offer, OfferStatus, Trade, TradeStatus } from "../domain/model";
// Item.prototype.
export let ItemSchema = new Schema({
  _id: String,
  userId: String,
  tradeId: String,
  offerId: String,
  createdAt: Date,
  name: String,
  price: Number,
});

export let OfferSchema = new Schema({
  _id: String,
  offererId: String,
  createdAt: Date,
  status: OfferStatus,
});

export let TradeSchema = new Schema({
  _id: String,
  userId: String,
  createdAt: Date,
  status: TradeStatus,
});
