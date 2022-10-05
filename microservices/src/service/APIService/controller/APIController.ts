import { ServiceBroker } from "moleculer";
import { Context } from "../../interfaces";

export class APIController {

    constructor(private broker: ServiceBroker){ }
    
    async createWorkspace(ctx: Context): Promise<any> {
        ctx.meta.$statusCode = 201;      
        return this.broker.call('user.createWorkspace', ctx.params);
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