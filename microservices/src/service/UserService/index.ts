import { ServiceBroker } from 'moleculer';
import { AuthService } from '../../stub/AuthService';
import { Context, Microservice } from '../interfaces';
import { connect } from '../mongodb-conn';
import { AdminCtrlSingleton, UserCtrlSingleton, WorkspaceCtrlSingleton } from './user-factories';

export var stubs: {
    authService: AuthService,
};

export class UserService implements Microservice {

    constructor(private broker: ServiceBroker) {
        stubs = {
            authService: new AuthService(this.broker),
        };
        Object.freeze(stubs);
    }

    async register() {
        // Connect MongoDB
        await connect();

        const wksCrtl = WorkspaceCtrlSingleton.getInstance();
        const adminCtrl = AdminCtrlSingleton.getInstance();
        const userCtrl = UserCtrlSingleton.getInstance();

        // Define a service
        this.broker.createService({
            name: 'user',

            hooks: {

                before: {
                    '*': [ (ctx: Context) => ctx.user = ctx.meta.user ],
                    '*Workspace': [ (ctx: Context) => wksCrtl.checkPermission(ctx) ],
                    // '*Admin': [ (ctx: Context) => adminCtrl.checkPermission(ctx) ],
                }
            },

            actions: {
                // Resource workspace actions
                createWorkspace: ctx => wksCrtl.create(ctx),
                updateWorkspace: ctx => wksCrtl.update(ctx),
                deleteWorkspace: ctx => wksCrtl.delete(ctx),
                getWorkspace   : ctx => wksCrtl.getOne(ctx),
                getAllWorkspace: ctx => wksCrtl.getAll(ctx),

                // Resource admin actions
                createAdmin: ctx => adminCtrl.create(ctx),
                updateAdmin: ctx => adminCtrl.update(ctx),
                deleteAdmin: ctx => adminCtrl.delete(ctx),
                getAdmin   : ctx => adminCtrl.getOne(ctx),
                getAllAdmin: ctx => adminCtrl.getAll(ctx),

                // Generate token user
                generateNewToken: ctx => userCtrl.generateNewToken(ctx),
                getUser   : ctx => userCtrl.getOne(ctx),
            },

        });

        // graceful shutdown service
        process.on('SIGINT', async () => {
            console.log(`##### graceful shutdown service ${this.broker.nodeID}`);
            await this.broker.stop();
        });

        // Start the broker
        return this.broker.start();
    }

}