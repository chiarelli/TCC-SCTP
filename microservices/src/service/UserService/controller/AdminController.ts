import { IUser } from "../../interfaces";
import { AdminModel } from "../model/AdminModel";
import { AbstractController } from "./AbstractController";

export class AdminController extends AbstractController<IUser> {

    constructor(ctrl: AdminModel) {
        super(ctrl);
    }

}