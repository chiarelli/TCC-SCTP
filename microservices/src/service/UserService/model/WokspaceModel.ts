import { Context, IUser } from "../../interfaces";
import { AbstractModel } from "./AbstractModel";
import { Workspace } from "./user-schema";

export class WorkspaceModel extends AbstractModel<IUser> {

    constructor() {
        super(Workspace);
    }

    async checkPermission(ctx: Context): Promise<void> {

        switch(ctx.action?.name) {
            case 'user.createAdmin':

                break;

            default:
        }

    }

}