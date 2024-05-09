import { Request, Response } from "express";
import { UUID } from "mongodb";
import auth_commands from "../auth/entrypoint/commands";
import auth_qry from "../auth/entrypoint/queries";
import auth_services from "../auth/entrypoint/services";
import { UnitOfWork } from "../entrypoint/uow";
import trading_cmd from "../trading/entrypoint/commands";
// import { io } from "../server";
// import {uow} from "../models/models";

class ResponseBody {
  message: string;
  data: any;
  constructor(message: string, data: any) {
    this.message = message;
    this.data = data;
  }
}

const uow = new UnitOfWork();

const createUser = async (req: Request, res: Response) => {
  const { fullName, userName, password } = req.body;
  if (!fullName || !userName || !password) {
    res.status(400).send("Missing parameters");
    return;
  }

  const uid = new UUID().toString();
  await auth_commands.createUser(
    uid,
    fullName,
    userName,
    password,
    new Date(),
    new Date(),
    uow,
  );

  await trading_cmd.initializeInventory(uid, uow);

  uow.commit_close();
  res.send({
    message: "User created",
    data: {
      uid: uid,
      userName: userName,
      fullName: fullName,
    },
  });
};

const validatePassword = async (req: Request, res: Response) => {
  const { userName, password } = req.query;
  // console.log(req);

  if (!userName || !password) {
    res.status(400).send("Missing parameters");
    return;
  }
  await auth_services.validatePassword(
    userName.toString(),
    password.toString(),
    uow,
  );
  const user = await uow.user_repo.getByUserName(userName.toString());
  if (!user) {
    res.status(400).send("user not found");
    return;
  }
  res.send({
    message: "Password validated",
    data: {
      uid: user._id,
      userName: user.userName,
      fullName: user.fullName,
    },
  });
};

const changePassword = async (req: Request, res: Response) => {
  const { uid, oldPassword, newPassword } = req.body;
  if (!uid || !oldPassword || !newPassword) {
    res.status(400).send("Missing parameters");
    return;
  }

  await auth_commands.changePassword(uid, oldPassword, newPassword, uow);
  res.send("Password changed");
};

const addItem = async (req: Request, res: Response) => {
  const { userId, name, description, price } = req.body;
  if (!userId || !name || !description || !price) {
    res.status(400).send("Missing parameters");
    return;
  }
  await trading_cmd.addItem(
    userId,
    new UUID().toString(),
    name,
    description,
    price,
    uow,
  );
  res.send("Item added");
};

const createTrade = async (req: Request, res: Response) => {
  const { userId, itemIds, conditions } = req.body;
  if (!userId || !itemIds || !conditions) {
    res.status(400).send("Missing parameters");
    return;
  }
  await trading_cmd.createTrade(
    userId,
    new UUID().toString(),
    itemIds,
    uow,
    conditions,
  );
  res.send("Trade created");
};

const createOffer = async (data: {
  tradeId: string;
  itemIds: string[];
  offererId: string;
  price: number;
}) => {
  const { tradeId, itemIds, offererId, price } = data;
  if (!tradeId || !itemIds || !offererId) {
    throw new Error("Missing parameters");
  }
  await trading_cmd.createOffer(tradeId, itemIds, offererId, uow, price);
  // res.send("Offer created");
  // io.emit("offer-created", req.body);
};

const acceptOffer = async (req: {
  userId: string;
  tradeId: string;
  offerId: string;
  offererId: string;
}) => {
  const { userId, tradeId, offerId, offererId } = req;
  if (!userId || !tradeId || !offerId || !offererId) {
    throw new Error("Missing parameters");
    return;
  }

  await trading_cmd.acceptOffer(userId, tradeId, offerId, offererId, uow);
  // let otherOffers = await uow.inventory_repo.
  // await trading_cmd.rejectOffer(userId, tradeId, offerId, x ,uow);
  const inv = await uow.inventory_repo.get(userId);
  return inv;
};

const getUserId = async (req: Request, res: Response) => {
  const { userName } = req.body;
  if (!userName) {
    res.status(400).send("Missing parameters");
    return;
  }
  const user = await uow.user_repo.getByUserName(userName);
  res.send(user);
};

const getAllItems = async (req: Request, res: Response) => {
  const { userId } = req.query;
  console.log(req.query);

  if (!userId) {
    res.status(400).send("Missing parameters");
    return;
  }

  const user = await uow.inventory_repo.get(userId.toString());
  if (!user) {
    res.status(400).send("User not found");
    return;
  }
  res.send({
    message: "Items retrieved",
    data: {
      items: user.items,
      cash: user.cash,
    },
  });
};

const getAllTrades = async (req: Request, res: Response) => {
  const trades = await auth_qry.getAllTrades(uow);
  res.send({
    message: "Trades retrieved",
    data: trades,
  });
};

const getAllOffers = async (req: Request, res: Response) => {
  const { tradeId, creatorId } = req.query;
  if (!tradeId || !creatorId) {
    res.status(400).send("Missing parameters");
    return;
  }
  const offers = await auth_qry.getAllOffers(
    tradeId.toString(),
    creatorId.toString(),
    uow,
  );
  res.send({
    message: "Offers retrieved",
    data: offers,
  });
};

const getInventory = async (req: Request, res: Response) => {
  const { userId } = req.query;
  if (!userId) {
    res.status(400).send("Missing parameters");
    return;
  }
  const user = await uow.inventory_repo.get(userId.toString());
  if (!user) {
    res.status(400).send("User not found");
    return;
  }
  res.send({
    message: "Inventory retrieved",
    data: user,
  });
};

const rejectOffer = async (req: Request, res: Response) => {
  const { uid, tradeId, offerId, offererId } = req.body;
  if (!uid || !tradeId || !offerId || !offererId) {
    res.status(400).send("Missing parameters");
    return;
  }
  await trading_cmd.rejectOffer(uid, tradeId, offerId, offererId, uow);
  res.send("Offer rejected");
};

export default {
  createUser,
  validatePassword,
  changePassword,
  addItem,
  createTrade,
  createOffer,
  acceptOffer,
  getUserId,
  getAllItems,
  getAllTrades,
  getAllOffers,
  getInventory,
  rejectOffer,
};
