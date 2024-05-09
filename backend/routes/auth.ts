import express, { Router } from "express";
import auth_controllers from "../controllers/auth";
import { middleware } from "../utils/exception";
// import auth from "../controllers/auth";
export const authRouter: Router = express.Router();

authRouter.post("/createUser", (req, res) =>
  middleware(req, res, auth_controllers.createUser),
);
authRouter.get("/validatePassword", (req, res) =>
  middleware(req, res, auth_controllers.validatePassword),
);
authRouter.post("/changePassword", (req, res) =>
  middleware(req, res, auth_controllers.changePassword),
);
authRouter.post("/addItem", (req, res) =>
  middleware(req, res, auth_controllers.addItem),
);
authRouter.post("/createTrade", (req, res) =>
  middleware(req, res, auth_controllers.createTrade),
);
// authRouter.post("/createOffer", (req, res) => middleware(req, res, auth_controllers.createOffer));
authRouter.post("/acceptOffer", (req, res) =>
  middleware(req, res, auth_controllers.acceptOffer),
);
authRouter.get("/getUserId", (req, res) =>
  middleware(req, res, auth_controllers.getUserId),
);
authRouter.get("/getAllItems", (req, res) =>
  middleware(req, res, auth_controllers.getAllItems),
);
authRouter.get("/getAllTrades", (req, res) =>
  middleware(req, res, auth_controllers.getAllTrades),
);
authRouter.get("/getAllOffers", (req, res) =>
  middleware(req, res, auth_controllers.getAllOffers),
);
// authRouter.post("/createUser", auth_controllers.createUser);
authRouter.get("/getInventory", (req, res) =>
  middleware(req, res, auth_controllers.getInventory),
);
// authRouter.get("/validatePassword", auth_controllers.validatePassword);
authRouter.post("/rejectOffer", (req, res) =>
  middleware(req, res, auth_controllers.rejectOffer),
);
// authRouter.post("/changePassword", auth_controllers.changePassword);
