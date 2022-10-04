import { AbstractModel } from "./AbstractModel";
import { IUser, Workspace } from "./user-schema";

export class WorkspaceModel extends AbstractModel<IUser> {

    constructor() {
        super(Workspace);
    }

}