import { ServiceBroker } from "moleculer";
import web from "moleculer-web";
import { AuthService } from "../../stub/AuthService";
import { UserService } from "../../stub/UserService";
import { Context, IToken, IUser, Microservice } from "../interfaces";
import { APIController } from "./controller/APIController";

const E = web.Errors;

export class BorderService implements Microservice {

    public static stubs: {
        userService: UserService,
        authService: AuthService,
    };

    constructor(private broker: ServiceBroker) {
        if(!BorderService.stubs) {
            BorderService.stubs = {
                authService: new AuthService(this.broker),
                userService: new UserService(this.broker),
            }
        }
    }

    private async signon(ctx: Context, route: any, req: any, res: any): Promise<void | never> {
        // console.log(`##### signon ${this.broker.nodeID}`);

        try {
            let auth = req.headers["authorization"];

            if(!auth || !auth.startsWith("Bearer") || !auth.slice(7))
                return Promise.reject(new E.UnAuthorizedError(E.ERR_NO_TOKEN, null));

            const [token_uuid, secret] = auth.slice(7).split('.');
            const token = <IToken | never>await ctx.call('api.getToken', { token_uuid, secret }, { parentCtx: ctx });

            if(!token) return Promise.reject(new E.UnAuthorizedError(E.ERR_INVALID_TOKEN, null));

            const user_uuid = token.owner instanceof Buffer
                            ? token.owner.toString('hex')
                            : token.owner;

            ctx.meta.user = <IUser | never>await ctx.call('api.getUserLogedin', { user_uuid }, { parentCtx: ctx })
            // const obj = await this.broker.cacher?.get(`api.getUserLogedin:${user_uuid}`)
            // console.log('############ ', obj, user_uuid);
        } catch (error) {
            console.error(error);
            return Promise.reject(new E.UnAuthorizedError(E.ERR_INVALID_TOKEN, null));
        }
    }

    async register() {

        // Define a service
        const apiCtrl = new APIController(this.broker);

        this.broker.createService({
            name: 'api',

            mixins: [web],

            actions: {
                createWorkspace: ctx => apiCtrl.createWorkspace(ctx),
                deleteWorkspace: ctx => apiCtrl.deleteWorkspace(ctx),
                createAdmin: ctx => apiCtrl.createAdmin(ctx),
                createTerm: ctx => apiCtrl.createTerm(ctx),
                deleteAdmin: ctx => apiCtrl.deleteAdmin(ctx),
                deleteTerm: ctx => apiCtrl.deleteTerm(ctx),
                getToken: {
                    cache: {
                        keys: ['token_uuid'],
                    },
                    handler: ctx => BorderService.stubs.authService.checkTokenValid(`${ctx.params.token_uuid}.${ctx.params.secret}`),
                },
                getUserLogedin: {
                    cache: {
                        keys: ['user_uuid'],
                    },
                    handler: ctx => BorderService.stubs.userService.getOneUser(ctx.params.user_uuid),
                }
            },

            settings: {
                routes: [
                    {
                        path: '/api',
                        authorization: true,
                        aliases: {
                            // Resource workspace routers
                            'POST workspaces': 'api.createWorkspace',
                            'PATCH workspaces/:id': 'user.updateWorkspace',
                            'DELETE workspaces/:id': 'api.deleteWorkspace',
                            'GET workspaces/:id': 'user.getWorkspace',
                            'GET workspaces': 'user.getAllWorkspace',

                            // Resource admin routers
                            'POST admins': 'api.createAdmin',
                            'PATCH admins/:id': 'user.updateAdmin',
                            'DELETE admins/:id': 'api.deleteAdmin',
                            'GET admins/:id': 'user.getAdmin',
                            'GET admins': 'user.getAllAdmin',

                            // Generate new token route
                            'POST users/token/:id': 'user.generateNewToken',

                            // Resource term routers
                            'POST terms': 'api.createTerm',
                            'GET terms': 'term.getAll',
                            'DELETE terms/:id': 'api.deleteTerm',
                            'PATCH terms/:id': 'term.update',
                            'PATCH terms/evaluate/:id': 'term.evaluate',
                            'GET terms/:id': 'term.get',
                        }
                    },
                    {
                        path: '/api/public',
                        aliases: {
                            // Resource public term routers
                            'GET terms': 'term.search',
                        }
                    },
                    {
                        path: '/api/dev',
                        aliases: {
                            // DEV TESTES
                            'GET checkTokenValid/:token': 'auth.checkTokenValid',
                            'POST admin': 'api.createAdmin',
                            'POST user/:id': 'user.generateNewToken',
                        }
                    }
            ]
            },

            methods: {
                authorize: (ctx, route, req, res) => this.signon(ctx, route, req, res)
            },

            events: {
                'cacher.clean.tokens': () => this.broker.cacher?.clean("api.getToken**"),
                'cacher.clean.user': async ({ user }: {  user: IUser }) => this.broker.cacher?.del(`api.getUserLogedin:${user.uuid}`),
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