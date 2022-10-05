import { ServiceBroker } from "moleculer";
import { Microservice } from "../interfaces";
import { connect } from "../mongodb-conn";
import { APIController } from "./controller/APIController";
import web from "moleculer-web";

export class APIService implements Microservice {

    constructor(private broker: ServiceBroker) {};
    
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
                routes: [{
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
                    }
                }]
            }
        });

        // graceful shutdown service
        process.on('SIGINT', async () => {
            console.log(`##### graceful shutdown service ${this.broker.nodeID}`);
            await this.broker.stop();
        });

        // Start the broker
        return this.broker.start();
    };

}