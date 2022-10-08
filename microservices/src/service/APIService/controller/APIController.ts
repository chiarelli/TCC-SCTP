import { ServiceBroker } from "moleculer";
import { Context } from "../../interfaces";

export class APIController {
    constructor(private broker: ServiceBroker){ }

    async createAdmin(ctx: Context): Promise<any> {
        ctx.meta.$statusCode = 201;
        return this.broker.call('user.createAdmin', ctx.params, { parentCtx: ctx });
    }

    async deleteAdmin(ctx: Context): Promise<any> {
        try {
            await this.broker.call('user.deleteAdmin', ctx.params, { parentCtx: ctx });
        } catch(e) {

        }
        ctx.meta.$statusCode = 204;
        return '';
    }

    async createWorkspace(ctx: Context): Promise<any> {
        ctx.meta.$statusCode = 201;
        return this.broker.call('user.createWorkspace', ctx.params, { parentCtx: ctx });
    }

    async deleteWorkspace(ctx: Context): Promise<any> {
        try {
            await this.broker.call('user.deleteWorkspace', ctx.params, { parentCtx: ctx });
        } catch(e) {

        }
        ctx.meta.$statusCode = 204;
        return '';
    }

}