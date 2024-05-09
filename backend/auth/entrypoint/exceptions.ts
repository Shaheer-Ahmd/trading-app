import { CustomException } from "../../utils/exception";

export class UserAlreadyExists extends CustomException {
  constructor(msg: string) {
    super(msg);
  }
}
