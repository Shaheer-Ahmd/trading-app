import { CustomException } from "../../utils/exception";

export default class UserNotFound extends CustomException {
  constructor(message: string) {
    super(message);
  }
}
