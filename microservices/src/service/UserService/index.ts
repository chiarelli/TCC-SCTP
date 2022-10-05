import { ServiceBroker } from 'moleculer';
import { Microservice } from '../interfaces';
import { connect } from '../mongodb-conn';
import { AdminCtrlSingleton, WorkspaceCtrlSingleton } from './user-factories';

export class UserService implements Microservice {

    constructor(private broker: ServiceBroker) { }
    
    async register() {
        // Connect MongoDB
        await connect();

        const wksCrtl = WorkspaceCtrlSingleton.getInstance();
        const adminCtrl = AdminCtrlSingleton.getInstance();
        
        // Define a service
        this.broker.createService({
            name: 'user',
            actions: {
                // Resource workspace actions
                createWorkspace: ctx => wksCrtl.create(ctx),
                updateWorkspace: ctx => wksCrtl.update(ctx),
                deleteWorkspace: ctx => wksCrtl.delete(ctx),
                getWorkspace   : ctx => wksCrtl.getOne(ctx),
                getAllWorkspace: ctx => wksCrtl.getAll(ctx),
                
                // Resource admin actions
                createAdmin: ctx => adminCtrl.create(ctx),
                updateAdmin: ctx => adminCtrl.update(ctx),
                deleteAdmin: ctx => adminCtrl.delete(ctx),
                getAdmin   : ctx => adminCtrl.getOne(ctx),
                getAllAdmin: ctx => adminCtrl.getAll(ctx),
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