import { ServiceError } from "../../../error/ServiceError";
import { Context, IUser, Permission } from "../../interfaces";
import { AdminModel } from "../model/AdminModel";
import { AbstractController } from "./AbstractController";

export class AdminController extends AbstractController<IUser> {

    constructor(ctrl: AdminModel) {
        super(ctrl);
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