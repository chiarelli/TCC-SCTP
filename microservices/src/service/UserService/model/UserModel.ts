import { UserService } from "..";
import { ServiceError } from "../../../error/ServiceError";
import { Statuses } from "../../enums";
import { IToken, Permission } from "../../interfaces";
import { UUID_Utilities } from "../../UUID_Utilities";
import { AbstractUser, Consumer, DocumentUserType } from "./user-schema";

export class UserModel {

    protected model: typeof AbstractUser;
    protected stubs;
    constructor() {
        this.model = AbstractUser;
        this.stubs = UserService.stubs;
    }

    async generateNewToken(uuid: string): Promise<IToken> {
        const owner: Buffer = UUID_Utilities.uuidToBuffer(uuid);

        if(
            !await this.model.findOne({ uuid: owner, status: Statuses.active })
            || !await this.stubs.authService.deleteOwnerTokens({ owner })
        ) throw new ServiceError("error_generating_token", 400);;

        return this.stubs.authService.createToken({ owner });
    }

    async getOne(uuid: string): Promise<DocumentUserType> {
        const model = await this.model.findOne({ uuid: UUID_Utilities.uuidToBuffer(uuid), status: Statuses.active })
        if(!model) return Promise.reject(new ServiceError("not_found", 404));
        return model;
    }

    async checkPermission(permision: Permission): Promise<boolean> {
        const user = permision.loggedIn;
        const perms: Promise<boolean>[] = [];
        if(!user) return false;

        if('user.generateNewToken' === permision.action) {

            await (async() => {

                const result1 = await this.stubs.authService.checkPermission(
                    { role: user.kind, actions: { name: 'updateAny', resource: 'consumer_key:user' } }
                )

                if(result1) { perms.push(Promise.resolve(true)); return; }

                let uuid = Buffer.from(user.uuid)
                let resourceId = UUID_Utilities.uuidToBuffer( new String(permision.params.id).toString() );

                if( 'consumer' === user.kind ) {
                    let consumer = await Consumer.findOne({ uuid: resourceId, status: Statuses.active });

                    if(consumer?.workspace.toString() !== user._id.toString()){ perms.push(Promise.resolve(false)); return; }

                } else
                if( 'workspace' === user.kind ) {
                    if(uuid.toString() !== resourceId.toString()) { perms.push(Promise.resolve(false)); return; }
                }

                perms.push(
                    this.stubs.authService.checkPermission(
                        { role: user.kind,
                            actions: { name: 'updateOwn', resource: `consumer_key:${user.kind}` }
                        }
                    )
                )

            })();

        }

        return !!(await Promise.all(perms)).filter( item => item ).length
    }

}