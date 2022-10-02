import { WorkspaceController } from "./controller/WorkspaceController";
import { WorkspaceModel } from "./model/WokspaceModel";

export class WorkspaceCtrlSingleton {
    private static tokenModel: WorkspaceController;

    static getInstance(): WorkspaceController {
        const _static = WorkspaceCtrlSingleton;
        if(!_static.tokenModel) {
            _static.tokenModel = new WorkspaceController(WorkspaceModelSingleton.getInstance());
        }
        return _static.tokenModel;
    }
}

export class WorkspaceModelSingleton {
    private static tokenModel: WorkspaceModel;

    static getInstance(): WorkspaceModel {
        const _static = WorkspaceModelSingleton;
        if(!_static.tokenModel) {
            _static.tokenModel = new WorkspaceModel;
        }
        return _static.tokenModel;
    }
}