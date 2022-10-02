import { ServiceBroker } from "moleculer";
import { Microservice } from "../interfaces";
import { connect } from "../mongodb-conn";
import web from "moleculer-web";

export class APIService implements Microservice {

    constructor(private broker: ServiceBroker) {};
    
    async register() {
        // Connect MongoDB
        await connect();

        // Define a service

        this.broker.createService({
            name: 'api',
            mixins: [web],
            actions: {
                // createWorkspace: ctx => apiCtrl.createWorkspace(ctx),
                // updateWorkspace: ctx => apiCtrl.updateWorkspace(ctx),
                // deleteWorkspace: ctx => apiCtrl.deleteWorkspace(ctx),
                // getWorkspace: ctx => apiCtrl.getWorkspace(ctx),
                // getAllWorkspace: ctx => apiCtrl.getAllWorkspace(ctx),
            },
            settings: {
                routes: [{
                    path: '/api',
                    aliases: {
                        // Resource workspace routers
                        // 'POST workspace': 'api.createWorkspace',
                        // 'PUT workspace/:id': 'api.updateWorkspace',
                        // 'DELETE workspace/:id': 'api.deleteWorkspace',
                        // 'GET workspace/:id': 'api.getWorkspace',
                        // 'GET workspace': 'api.getAllWorkspace',
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