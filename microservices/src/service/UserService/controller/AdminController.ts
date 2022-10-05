import { AdminModel } from "../model/AdminModel";
import { IUser } from "../model/user-schema";
import { AbstractController } from "./AbstractController";

export class AdminController extends AbstractController<IUser> {

    constructor(ctrl: AdminModel) {
        super(ctrl);
    }

}