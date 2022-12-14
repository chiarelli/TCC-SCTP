import { ServiceBroker } from 'moleculer';
import { AuthService } from '../../stub/AuthService';
import { Context, Microservice } from '../interfaces';
import { connect } from '../mongodb-conn';
import { ListingParams, UserParams } from '../switchblade';
import { AdminCtrlSingleton, UserCtrlSingleton, WorkspaceCtrlSingleton } from './user-factories';

export class UserService implements Microservice {

    public static stubs: {
        authService: AuthService,
    };

    constructor(private broker: ServiceBroker) {
        if(!UserService.stubs) {
            UserService.stubs = {
                authService: new AuthService(this.broker),
            };
        }
    }

    private cleanCacheWriteUser(ctx: Context, user: any) {
        if(user) {
            this.broker.broadcast('cacher.clean.users');
            this.broker.broadcast('cacher.clean.user', { user });
        }
        return user;
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
                    '*Admin': [ (ctx: Context) => adminCtrl.checkPermission(ctx) ],
                    'generateNewToken': [ (ctx: Context) => userCtrl.checkPermission(ctx) ],
                },

                after: {
                    'update*': [ (ctx, res) => this.cleanCacheWriteUser(ctx, res) ],
                    'delete*': [ (ctx, res) => this.cleanCacheWriteUser(ctx, res) ],
                },
            },

            actions: {
                // Resource workspace actions
                createWorkspace: {
                    params: UserParams,
                    handler:ctx => wksCrtl.create(ctx)
                },
                updateWorkspace: {
                    params: UserParams,
                    handler: ctx => wksCrtl.update(ctx)
                },
                deleteWorkspace: ctx => wksCrtl.delete(ctx),
                getWorkspace   : ctx => wksCrtl.getOne(ctx),
                getAllWorkspace: {
                    params: ListingParams,
                    handler: ctx => wksCrtl.getAll(ctx),
                },


                // Resource admin actions
                createAdmin: {
                    params: UserParams,
                    handler: ctx => adminCtrl.create(ctx),
                },
                updateAdmin: {
                    params: UserParams,
                    handler: ctx => adminCtrl.update(ctx)
                },
                deleteAdmin: ctx => adminCtrl.delete(ctx),
                getAdmin   : ctx => adminCtrl.getOne(ctx),
                getAllAdmin: {
                    params: ListingParams,
                    handler: ctx => adminCtrl.getAll(ctx),
                },

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