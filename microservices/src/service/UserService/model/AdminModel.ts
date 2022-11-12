import { IUser, Permission } from "../../interfaces";
import { AbstractModel } from "./AbstractModel";
import { Admin } from "./user-schema";

export class AdminModel extends AbstractModel<IUser> {

    constructor() {
        super(Admin);
    }

    async checkPermission(permision: Permission): Promise<boolean> {
        const user = permision.loggedIn;
        const perms: Promise<boolean>[] = [];
        if(!user) return false;

        switch(permision.action) {
            case 'user.deleteAdmin':

            perms.push(this.stubs.authService.checkPermission(
                { role: user.kind, actions: { name: 'deleteAny', resource: 'user:admin' } }
            ));

            break;

            case 'user.getAdmin':
            case 'user.getAllAdmin':

            perms.push(this.stubs.authService.checkPermission(
                { role: user.kind, actions: { name: 'readAny', resource: 'user:admin' } }
            ));

            break;

            case 'user.createAdmin':

            perms.push(this.stubs.authService.checkPermission(
                { role: user.kind, actions: { name: 'createAny', resource: 'user:admin' } }
            ));

            break;

            case 'user.updateAdmin':

            perms.push(this.stubs.authService.checkPermission(
                { role: user.kind, actions: { name: 'updateAny', resource: 'user:admin' } }
            ));

            break;
        }

        return !!(await Promise.all(perms)).filter( item => item ).length
    }

}