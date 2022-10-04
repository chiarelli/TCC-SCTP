import { AbstractModel } from "./AbstractModel";
import { Workspace } from "./user-schema";

export class WorkspaceModel extends AbstractModel {

    constructor() {
        super(Workspace);
    }

}