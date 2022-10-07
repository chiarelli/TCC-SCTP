import { ServiceError } from "../../../error/ServiceError";
import { Context } from "../../interfaces";
import { DocumentTokenType } from "../model/token-schema";
import { TokenModel } from "../model/TokenModel";

export class TokenController {

    constructor(private model: TokenModel) { }

    async checkValid(ctx: Context) {
        return this.model.valid(ctx.params['token'])
            .then(token => token
                ? this.export(token)
                : Promise.reject( new ServiceError('invalid_token', 400) )
            );
    }

    async create(ctx: Context) {
        return this.model.create(ctx.params)
            .then(token => this.export(token))
    }

    async deleteOwnerTokens(ctx: Context) {
        return this.model.deleteOwnerTokens(ctx.params.owner);
    }

    protected export(token: DocumentTokenType | false | undefined) {
        if(!token) return false;

        const data = <any>token.toJSON();
        data.token = token._token;
        data.owner = token.owner;

        delete data._id;
        delete data.uuid;
        delete data.__v;
        delete data.hash;
        delete data.updatedAt;

        return data;
    }

}