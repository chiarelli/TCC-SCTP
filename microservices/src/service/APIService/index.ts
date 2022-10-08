import { ServiceBroker } from "moleculer";
import web from "moleculer-web";
import { AuthService } from "../../stub/AuthService";
import { UserService } from "../../stub/UserService";
import { Context, Microservice } from "../interfaces";
import { connect } from "../mongodb-conn";
import { APIController } from "./controller/APIController";

const E = web.Errors;

export var stubs: {
    userService: UserService,
    authService: AuthService,
}

export class APIService implements Microservice {

    constructor(private broker: ServiceBroker) {
        stubs = Object.freeze({
            authService: new AuthService(this.broker),
            userService: new UserService(this.broker),
        });
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

        try {
            let auth = req.headers["authorization"];

            if(!auth || !auth.startsWith("Bearer") || !auth.slice(7))
                return Promise.reject(new E.UnAuthorizedError(E.ERR_NO_TOKEN, null));

            const token = await stubs.authService.checkTokenValid(auth.slice(7));
            if(!token) return Promise.reject(new E.UnAuthorizedError(E.ERR_INVALID_TOKEN, null));

            const uuid = token.owner instanceof Buffer
                            ? token.owner.toString('hex')
                            : token.owner;

            ctx.meta.user = await stubs.userService.getOneUser(uuid);
        } catch (error) {
            console.error(error);
            return Promise.reject(new E.UnAuthorizedError(E.ERR_INVALID_TOKEN, null));
        }
    }

}