import { ServiceBroker } from 'moleculer';
import { AuthService } from '../../stub/AuthService';
import { Context, Microservice } from '../interfaces';
import { connect } from '../mongodb-conn';
import { AdminCtrlSingleton, UserCtrlSingleton, WorkspaceCtrlSingleton } from './user-factories';

const LIMIT_MAX = process.env.LIMIT_MAX;

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
                    // '*Admin': [ (ctx: Context) => adminCtrl.checkPermission(ctx) ],
                    // 'generateNewToken': [ (ctx: Context) => userCtrl.checkPermission(ctx) ],
                },

                after: {
                    'update*': [ (ctx, res) => this.cleanCacheWriteUser(ctx, res) ],
                    'delete*': [ (ctx, res) => this.cleanCacheWriteUser(ctx, res) ],
                },
            },

            actions: {
                // Resource workspace actions
                createWorkspace: ctx => wksCrtl.create(ctx),
                updateWorkspace: ctx => wksCrtl.update(ctx),
                deleteWorkspace: ctx => wksCrtl.delete(ctx),
                getWorkspace   : ctx => wksCrtl.getOne(ctx),
                getAllWorkspace: {
                    params: {
                        limit: `number|convert|integer|min:0|max:${LIMIT_MAX}|default:20`,
                        offset: "number|convert|integer|min:0|default:0"
                    },
                    handler: ctx => wksCrtl.getAll(ctx),
                },


                // Resource admin actions
                createAdmin: ctx => adminCtrl.create(ctx),
                updateAdmin: ctx => adminCtrl.update(ctx),
                deleteAdmin: ctx => adminCtrl.delete(ctx),
                getAdmin   : ctx => adminCtrl.getOne(ctx),
                getAllAdmin: {
                    params: {
                        limit: `number|convert|integer|min:0|max:${LIMIT_MAX}|default:20`,
                        offset: "number|convert|integer|min:0|default:0"
                    },
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