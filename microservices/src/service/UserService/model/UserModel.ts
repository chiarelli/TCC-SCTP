import { UUID_Utilities } from "../../UUID_Utilities";
import { stubs } from "..";
import { AbstractUser, DocumentUserType } from "./user-schema";
import { Statuses } from "../../enums";
import { IToken } from "../../interfaces";
import { ServiceError } from "../../../error/ServiceError";

export class UserModel {

    protected stubs: typeof stubs;
    protected model: typeof AbstractUser;

    constructor() {
        this.model = AbstractUser;
        this.stubs = stubs;
    };

    async generateNewToken(uuid: string): Promise<IToken> {
        const owner: Buffer = UUID_Utilities.uuidToBuffer(uuid);

        if(
            !await this.model.findOne({ uuid: owner, status: Statuses.active })
            || !await this.stubs.authService.deleteOwnerTokens({ owner })
        ) throw new ServiceError("error_generating_token", 400);;

        return this.stubs.authService.createToken({ owner });
    }

    async getOne(uuid: string): Promise<DocumentUserType> {
        const model = await this.model.findOne({ uuid: UUID_Utilities.uuidToBuffer(uuid), status: Statuses.active })
        if(!model) return Promise.reject(new ServiceError("not_found", 404));
        return model;
    }

}