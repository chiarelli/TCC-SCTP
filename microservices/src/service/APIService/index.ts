import { ServiceBroker } from "moleculer";
import { Context, Microservice } from "../interfaces";
import { connect } from "../mongodb-conn";
import { APIController } from "./controller/APIController";
import web from "moleculer-web";
import { UserService } from "../../stub/UserService";
import { AuthService } from "../../stub/AuthService";
import { ServiceError } from "../../error/ServiceError";

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

            hooks: {
                before: {
                    '*': ctx => this.signon(ctx),
                }
            },

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
                        path: '/dev',
                        aliases: {
                            // DEV TESTES
                            'GET checkTokenValid/:token': 'auth.checkTokenValid',
                        }
                    }
            ]
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

    private async signon(ctx: Context): Promise<void | never> {
        try {
            const token = this.getToken(ctx);
            if(!token) throw new Error();
            const data = await stubs.authService.checkTokenValid(token);
            const uuid = data.owner instanceof Buffer
                            ? data.owner.toString('hex')
                            : data.owner;

            ctx.meta.user = await stubs.userService.getOneUser(uuid);
        } catch (error) {
            console.error(error);
            throw new ServiceError('401_unauthorized', 401, <Error>error);
        }
    }

    private getToken(ctx: Context): string | false {
        try {
            const headers = ctx.params.req.rawHeaders;
            const bearer = headers[headers.indexOf('Authorization')+1];
            const [, token] = bearer.split(' ');
            return token
        } catch (error) {
            return false;
        }
    }

}