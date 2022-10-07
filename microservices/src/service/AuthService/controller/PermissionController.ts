import { Context } from "../../interfaces";
import { PermissionModel } from "../model/PermissionModel";

export class PermissionController {

    constructor(private model: PermissionModel){}

    async check(ctx: Context): Promise<boolean> {
        return this.model.check(ctx.params);
    }

}