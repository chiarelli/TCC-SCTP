import { AbstractModel } from "./AbstractModel";
import { Admin, IUser } from "./user-schema";

export class AdminModel extends AbstractModel<IUser> {

    constructor() {
        super(Admin);
    }

}