import { Context, IUser } from "../../interfaces";
import { WorkspaceModel } from "../model/WokspaceModel";
import { AbstractController } from "./AbstractController";

export class WorkspaceController extends AbstractController<IUser> {

    async checkPermission(ctx: Context): Promise<void> {
        throw new Error('Method not implemented.');
    }

    constructor(ctrl: WorkspaceModel) {
        super(ctrl);
    }

}