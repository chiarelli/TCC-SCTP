import { Context } from "../../interfaces";
import { TokenModel } from "../model/TokenModel";

export class TokenController {

    constructor(private model: TokenModel) { }

    async checkValid(ctx: Context) {
        return this.model.valid(ctx.params['token_uuid'], ctx.params['plain_text']);
    }

    async create(ctx: Context) {
        return this.model.create(ctx.params)
            .then(token => {
                const data = <any>token.toJSON();
                data.uuid = token.uuid;
                data.token = token._token;
                data.owner = token.owner;

                delete data._id;
                delete data.__v;
                delete data.hash;

                return data;
            })
    }

    async deleteOwnerTokens(ctx: Context) {
        return this.model.deleteOwnerTokens(ctx.params.owner);
    }

}