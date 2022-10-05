import { IUser } from "../model/user-schema";
import { WorkspaceModel } from "../model/WokspaceModel";
import { AbstractController } from "./AbstractController";

export class WorkspaceController extends AbstractController<IUser> {

    constructor(ctrl: WorkspaceModel) {
        super(ctrl);
    }

}