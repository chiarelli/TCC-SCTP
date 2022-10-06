import { Context, IUser } from "../../interfaces";
import { AbstractModel } from "./AbstractModel";
import { Admin } from "./user-schema";

export class AdminModel extends AbstractModel<IUser> {

    constructor() {
        super(Admin);
    }

    checkPermission(ctx: Context): Promise<void> {
        throw new Error("Method not implemented.");
    }

}