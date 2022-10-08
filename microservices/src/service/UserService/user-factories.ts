import { AdminController } from "./controller/AdminController";
import { UserController } from "./controller/UserController";
import { WorkspaceController } from "./controller/WorkspaceController";
import { AdminModel } from "./model/AdminModel";
import { UserModel } from "./model/UserModel";
import { WorkspaceModel } from "./model/WokspaceModel";

export class WorkspaceCtrlSingleton {
    private static ctrl: WorkspaceController;

    static getInstance(): WorkspaceController {
        const _static = WorkspaceCtrlSingleton;
        if(!_static.ctrl) {
            _static.ctrl = new WorkspaceController(WorkspaceModelSingleton.getInstance());
        }
        return _static.ctrl;
    }
}

export class AdminCtrlSingleton {
    private static ctrl: AdminController;

    static getInstance(): AdminController {
        const _static = AdminCtrlSingleton;
        if(!_static.ctrl) {
            _static.ctrl = new AdminController(AdminModelSingleton.getInstance());
        }
        return _static.ctrl;
    }
}

export class UserCtrlSingleton {
    private static ctrl: UserController;

    static getInstance(): UserController {
        if(!this.ctrl) {
            this.ctrl = new UserController(UserModelSingleton.getInstance());
        }
        return this.ctrl;
    }
}

export class WorkspaceModelSingleton {
    private static model: WorkspaceModel;

    static getInstance(): WorkspaceModel {
        const _static = WorkspaceModelSingleton;
        if(!_static.model) {
            _static.model = new WorkspaceModel;
        }
        return _static.model;
    }
}

export class AdminModelSingleton {
    private static model: AdminModel;

    static getInstance(): AdminModel {
        const _static = AdminModelSingleton;
        if(!_static.model) {
            _static.model = new AdminModel;
        }
        return _static.model;
    }
}

export class UserModelSingleton {
    private static model: UserModel;

    static getInstance(): UserModel {
        if(!this.model) {
            this.model = new UserModel;
        }
        return this.model;
    }
}