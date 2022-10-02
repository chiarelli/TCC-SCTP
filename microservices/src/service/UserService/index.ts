import { ServiceBroker } from 'moleculer';
import { Microservice } from '../interfaces';
import { connect } from '../mongodb-conn';
import { WorkspaceCtrlSingleton } from './user-factories';

export class UserService implements Microservice {

    constructor(private broker: ServiceBroker) { }
    
    async register() {
        // Connect MongoDB
        await connect();

        const wksCrtl = WorkspaceCtrlSingleton.getInstance();
        
        // Define a service
        this.broker.createService({
            name: 'user',
            actions: {
                createWorkspace: ctx => wksCrtl.create(ctx),
                updateWorkspace: ctx => wksCrtl.update(ctx),
                deleteWorkspace: ctx => wksCrtl.delete(ctx),
                getWorkspace   : ctx => wksCrtl.getOne(ctx),
                getAllWorkspace: ctx => wksCrtl.getAll(ctx),
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