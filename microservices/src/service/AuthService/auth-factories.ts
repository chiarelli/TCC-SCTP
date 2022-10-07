import { PermissionController } from './controller/PermissionController';
import { TokenController } from './controller/TokenController';
import { PermissionModel } from './model/PermissionModel';
import { TokenModel } from './model/TokenModel'

export class TokenModelSingleton {
    private static model: TokenModel;

    static getInstance(): TokenModel {
        if(!this.model) {
            this.model = new TokenModel;
        }
        return this.model;
    }

}

export class PermissionModelSingleton {
    private static model: PermissionModel;

    static getInstance(): PermissionModel {
        if(!this.model) {
            this.model = new PermissionModel;
        }
        return this.model;
    }

}

export class TokenControllerSingleton {
    private static ctrl: TokenController;

    static getInstance(): TokenController {
        if(!this.ctrl) {
            this.ctrl = new TokenController( TokenModelSingleton.getInstance() );
        }
        return this.ctrl;
    }
}

export class PermissionControllerSingleton {
    private static ctrl: PermissionController;

    static getInstance(): PermissionController {
        if(!this.ctrl) {
            this.ctrl = new PermissionController( PermissionModelSingleton.getInstance() );
        }
        return this.ctrl;
    }
}