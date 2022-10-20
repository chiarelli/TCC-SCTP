import { ServiceBroker } from "moleculer";
import { Context } from "../../interfaces";

export class APIController {
    constructor(private broker: ServiceBroker){ }

    async createAdmin(ctx: Context): Promise<any> {
        ctx.meta.$statusCode = 201;
        return this.broker.call('user.createAdmin', ctx.params, { parentCtx: ctx });
    }

    async createWorkspace(ctx: Context): Promise<any> {
        ctx.meta.$statusCode = 201;
        return this.broker.call('user.createWorkspace', ctx.params, { parentCtx: ctx });
    }

    async createTerm(ctx: Context): Promise<any> {
        ctx.meta.$statusCode = 201;
        return this.broker.call('term.create', ctx.params, { parentCtx: ctx });
    }

    async deleteAdmin(ctx: Context): Promise<any> {
        try {
            await this.broker.call('user.deleteAdmin', ctx.params, { parentCtx: ctx });
        } catch(e) {

        }
        ctx.meta.$statusCode = 204;
        return '';
    }

    async deleteWorkspace(ctx: Context): Promise<any> {
        try {
            await this.broker.call('user.deleteWorkspace', ctx.params, { parentCtx: ctx });
        } catch(e) {

        }
        ctx.meta.$statusCode = 204;
        return '';
    }

    async deleteTerm(ctx: Context) {
        try {
            await this.broker.call('term.delete', ctx.params, { parentCtx: ctx });
        } catch(e) {

        }
        ctx.meta.$statusCode = 204;
        return '';
    }
}