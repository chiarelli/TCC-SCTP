import { AccessControl } from "accesscontrol";
import { Capabilities } from "../../interfaces";

export class PermissionModel {

    async check({ role, actions, relation }: Capabilities): Promise<boolean> {
        actions = Array.isArray(actions) ? actions : [actions];
        var result = false;
        var _relation = relation === undefined ? 'AND' : relation;

        actions.forEach(action => {
            // console.log('##### granted ==> ', ac.can(role)[action.name](action.resource).granted );
            result = ac.can(role)[action.name](action.resource).granted;

            if(_relation === 'OR' && result || _relation === 'AND' && !result) {
                return false;
            }

        });
        // console.log('##### RESULT FINAL ==> ', result );
        // console.log({ role, actions, _relation })
        return result;
    }

}

const ac = new AccessControl();

ac.grant('consumer')
    .createOwn('term')
    .readOwn('term')
    .updateOwn('term')
    .deleteOwn('term')
;

ac.grant('workspace')
    .readOwn('profile:workspace')
    .updateOwn('profile:workspace')

    .readAny('profile:consumer')
    .updateAny('profile:consumer')
    .deleteAny('profile:consumer')

    .createOwn('user:consumer')

    .updateAny('consumer_key:consumer')
    .updateOwn('consumer_key:workspace')
    .readAny('consumer_key:workspace')

    .createAny('term')
    .readAny('term')
    .updateAny('term')
    .deleteAny('term')
    .updateAny('term:status')
;

ac.grant('admin')
    .createAny('user')
    .readAny('user')
    .updateAny('user')
    .deleteAny('user')

    .updateAny('consumer_key:user')

    .createAny('term')
    .readAny('term')
    .updateAny('term')
    .deleteAny('term')
    .updateAny('term:status')
;