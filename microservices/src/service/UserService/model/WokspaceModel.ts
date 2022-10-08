import { IUser, Permission } from "../../interfaces";
import { UUID_Utilities } from "../../UUID_Utilities";
import { AbstractModel } from "./AbstractModel";
import { Workspace } from "./user-schema";

export class WorkspaceModel extends AbstractModel<IUser> {

    constructor() {
        super(Workspace);
    }

    async checkPermission(permision: Permission): Promise<boolean> {
        const user = permision.loggedIn;
        const perms: Promise<boolean>[] = [];
        // console.log('###### permision ----> ', permision)
        if(!user) return false;

        switch(permision.action) {

            case 'user.deleteWorkspace':

                perms.push(this.stubs.authService.checkPermission(
                    { role: user.kind, actions: { name: 'deleteAny', resource: 'user' } }
                ));

                break;

            case 'user.getAllWorkspace':

                perms.push(this.stubs.authService.checkPermission(
                    { role: user.kind, actions: { name: 'readAny', resource: 'user' } }
                ));

                break;

            case 'user.createWorkspace':

                perms.push(this.stubs.authService.checkPermission(
                    { role: user.kind, actions: { name: 'createAny', resource: 'user' } }
                ));

                break;

            case 'user.getWorkspace':

                const result1 = await this.stubs.authService.checkPermission(
                    { role: user.kind, actions: { name: 'readAny', resource: 'user' } }
                )

                if(result1) { perms.push(Promise.resolve(true)); break; }

                let uuid = typeof user.uuid === 'string' ? user.uuid : Buffer.from(user.uuid).toString('hex');
                let resourceId = new String(permision.params.id).toString();
                const result2 = uuid == UUID_Utilities.uuidToBuffer(resourceId).toString('hex')

                if(!result2) { perms.push(Promise.resolve(false)); break; }

                perms.push(
                    this.stubs.authService.checkPermission(
                        { role: user.kind,
                            actions: { name: 'readOwn', resource: 'profile:workspace' }
                        }
                    )
                )

                break;

            case 'user.updateWorkspace':

                const result3 = await this.stubs.authService.checkPermission(
                    { role: user.kind, actions: { name: 'updateAny', resource: 'user' } }
                )

                if(result3) { perms.push(Promise.resolve(true)); break; }

                let uuid2 = typeof user.uuid === 'string' ? user.uuid : Buffer.from(user.uuid).toString('hex');
                let resourceId2 = new String(permision.params.id).toString();
                const result4 = uuid2 == UUID_Utilities.uuidToBuffer(resourceId2).toString('hex')

                if(!result4) { perms.push(Promise.resolve(false)); break; }

                perms.push(
                    this.stubs.authService.checkPermission(
                        { role: user.kind,
                            actions: { name: 'updateOwn', resource: 'profile:workspace' }
                        }
                    )
                )

                break;

        }

        return !!(await Promise.all(perms)).filter( item => item ).length
    }

}