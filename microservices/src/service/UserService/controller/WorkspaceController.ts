import { ServiceError } from "../../../error/ServiceError";
import { Context, IUser, Permission } from "../../interfaces";
import { WorkspaceModel } from "../model/WokspaceModel";
import { AbstractController } from "./AbstractController";

export class WorkspaceController extends AbstractController<IUser> {

    constructor(ctrl: WorkspaceModel) {
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