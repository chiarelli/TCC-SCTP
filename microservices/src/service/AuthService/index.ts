import { ServiceBroker } from 'moleculer';
import { Microservice } from '../interfaces';
import { connect } from '../mongodb-conn';
import { PermissionControllerSingleton, TokenControllerSingleton } from './auth-factories';

export class AuthService implements Microservice {

    constructor(private broker: ServiceBroker) { };

    async register(): Promise<void> {
        // Connect MongoDB
        await connect();

        // Controllers
        const tokenCtrl = TokenControllerSingleton.getInstance();
        const permCtrl = PermissionControllerSingleton.getInstance();

        // Define a service
        this.broker.createService({
            name: 'auth',

            hooks: {
                after: {
                    deleteOwnerTokens: [
                        (ctx, res) => {
                            if(res?.deletedCount)
                                this.broker.broadcast('cacher.clean.tokens')
                            return res;
                        }
                    ]
                }
            },

            actions: {
                checkTokenValid: {
                    params: {
                        token: 'string',

                    },
                    handler: ctx => tokenCtrl.checkValid(ctx)
                },
                createToken: {
                    params: {
                        owner: 'any',
                    },
                    handler: ctx => tokenCtrl.create(ctx),
                },
                deleteOwnerTokens: {
                    params: {
                        owner: 'any',
                    },
                    handler: ctx => tokenCtrl.deleteOwnerTokens(ctx),
                },
                checkPermission: {
                    params: {
                        role: 'string',
                        actions: 'any',
                        relation: 'string|optional'
                    },
                    handler: ctx => permCtrl.check(ctx),
                },
            }

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