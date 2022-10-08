import { Context } from "../../interfaces";
import { UserModel } from "../model/UserModel";

export class UserController {

    constructor(private ctrl: UserModel) {}

    async generateNewToken(ctx: Context) {
        return this.ctrl.generateNewToken(ctx.params.id);
    }

    async getOne(ctx: Context) {
        return this.ctrl.getOne(ctx.params.uuid)
            .then( user => user.toJSON() )
    }

}