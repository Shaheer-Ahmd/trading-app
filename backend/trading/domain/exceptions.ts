import { CustomException } from "../../utils/exception";


export class InvalidTrade extends CustomException {
    constructor(msg: string) {
        super(msg);
    }
}

export class InvalidItem extends CustomException {
    constructor(msg: string) {
        super(msg);
    }
}

export class InvalidOffer extends CustomException {
    constructor(msg: string) {
        super(msg);
    }
}