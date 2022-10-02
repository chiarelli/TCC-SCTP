import { ServiceBroker } from "moleculer";
import { Context } from "../../interfaces";

export class APIController {

    constructor(private broker: ServiceBroker){ }
    
    getAllWorkspace(ctx: Context): any {
        return this.broker.call('user.getAllWorkspace', ctx.params);
    }

    getWorkspace(ctx: Context): any {
        return this.broker.call('user.getWorkspace', ctx.params);
    }

    createWorkspace(ctx: Context): any {
        ctx.meta.$statusCode = 201;      
        return this.broker.call('user.createWorkspace', ctx.params);
    }

    updateWorkspace(ctx: Context): any {
        return this.broker.call('user.updateWorkspace', ctx.params);
    }

    async deleteWorkspace(ctx: Context): Promise<any> {
        try {
            await this.broker.call('user.deleteWorkspace', ctx.params);
        } catch(e) {

        }
        ctx.meta.$statusCode = 204;
        return '';
    }
    
}