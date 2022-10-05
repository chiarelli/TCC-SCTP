import { AdminController } from "./controller/AdminController";
import { WorkspaceController } from "./controller/WorkspaceController";
import { AdminModel } from "./model/AdminModel";
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