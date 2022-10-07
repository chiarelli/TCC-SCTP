import { ServiceBroker } from 'moleculer';
import { Microservice } from '../interfaces';
import { connect } from '../mongodb-conn';
import { PermissionControllerSingleton, TokenControllerSingleton } from './auth-factories';

export class AuthService implements Microservice {

    constructor(private broker: ServiceBroker) { };

    async register() {
        // Connect MongoDB
        await connect();

        // Controllers
        const tokenCtrl = TokenControllerSingleton.getInstance();
        const permCtrl = PermissionControllerSingleton.getInstance();

        // Define a service
        this.broker.createService({
            name: 'auth',
            actions: {
                checkTokenValid: {
                    params: {
                        token_uuid: 'string',
                        plain_text: 'string',

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
                        actions: 'string',
                        resource: 'string',
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