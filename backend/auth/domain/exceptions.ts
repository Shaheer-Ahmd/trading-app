import { CustomException } from "../../utils/exception";

export class InvalidPassword extends CustomException {
  constructor() {
    super("Invalid password");
  }
}
