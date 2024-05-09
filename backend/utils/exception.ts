import { Request, Response, NextFunction } from "express";

export class CustomException extends Error {
  constructor(message: string) {
    super(message);
  }
}

export const middleware: Function = async (
  req: Request,
  res: Response,
  controller: Function,
) => {
  try {
    console.log(`${controller.name} function hit`);
    await controller(req, res);
  } catch (e: any) {
    if (e instanceof CustomException) {
      console.log("Custom exception");
      res.status(404).send(e.message);
      return;
    }
    console.log(e.message);
    res.status(500).send(e.message);
  }
};

// export default {
//     CustomException,
//     middleware
// }
