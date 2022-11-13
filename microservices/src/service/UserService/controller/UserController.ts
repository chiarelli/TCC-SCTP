import { ServiceError } from "../../../error/ServiceError";
import { Context, Permission } from "../../interfaces";
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

    async checkPermission(ctx: Context): Promise<void | never> {
        if( !ctx.action?.name ) {
            throw new ServiceError('action_not_defined');
        }
        const per: Permission = {
            action: ctx.action.name,
            loggedIn: ctx.user,
            params: ctx.params,
        }
        if( ! await this.ctrl.checkPermission(per) ) {
            throw new ServiceError('401 Unauthorized', 401);
        }
    }
}