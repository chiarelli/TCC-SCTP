import { ServiceBroker } from "moleculer";
import web from "moleculer-web";
import { AuthService } from "../../stub/AuthService";
import { UserService } from "../../stub/UserService";
import { Context, IToken, IUser, Microservice } from "../interfaces";
import { connect } from "../mongodb-conn";
import { APIController } from "./controller/APIController";

const E = web.Errors;

export class APIService implements Microservice {

    public static stubs: {
        userService: UserService,
        authService: AuthService,
    };

    constructor(private broker: ServiceBroker) {
        if(!APIService.stubs) {
            APIService.stubs = {
                authService: new AuthService(this.broker),
                userService: new UserService(this.broker),
            }
        }
    };

    async register() {
        // Connect MongoDB
        await connect();

        // Define a service
        const apiCtrl = new APIController(this.broker);

        this.broker.createService({
            name: 'api',

            mixins: [web],

            actions: {
                createWorkspace: ctx => apiCtrl.createWorkspace(ctx),
                deleteWorkspace: ctx => apiCtrl.deleteWorkspace(ctx),
                createAdmin: ctx => apiCtrl.createAdmin(ctx),
                deleteAdmin: ctx => apiCtrl.deleteAdmin(ctx),
                getToken: {
                    cache: {
                        keys: ['token_uuid'],
                    },
                    handler: ctx => APIService.stubs.authService.checkTokenValid(`${ctx.params.token_uuid}.${ctx.params.secret}`),
                },
                getUserLogedin: {
                    cache: {
                        keys: ['user_uuid'],
                    },
                    handler: ctx => APIService.stubs.userService.getOneUser(ctx.params.user_uuid),
                }
            },

            settings: {
                routes: [
                    {
                        path: '/api',
                        authorization: true,
                        aliases: {
                            // Resource workspace routers
                            'POST workspace': 'api.createWorkspace',
                            'PATCH workspace/:id': 'user.updateWorkspace',
                            'DELETE workspace/:id': 'api.deleteWorkspace',
                            'GET workspace/:id': 'user.getWorkspace',
                            'GET workspace': 'user.getAllWorkspace',

                            // Resource admin routers
                            'POST admin': 'api.createAdmin',
                            'PATCH admin/:id': 'user.updateAdmin',
                            'DELETE admin/:id': 'api.deleteAdmin',
                            'GET admin/:id': 'user.getAdmin',
                            'GET admin': 'user.getAllAdmin',

                            // Generate new token route
                            'POST user/:id': 'user.generateNewToken',
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
    };

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

}