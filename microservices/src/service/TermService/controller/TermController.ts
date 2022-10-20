import { ServiceError } from "../../../error/ServiceError";
import { Context, ITerm } from "../../interfaces";
import { DocumentTermType } from "../model/term-schema";
import { TermModel } from "../model/TermModel";

export class TermController {

    constructor(protected ctrl: TermModel) {

    }

    protected export(model: DocumentTermType): ITerm {
        const data = <any>model.toObject();
            data.uuid = model.uuid;
        delete data.author;
        delete data._id;
        delete data.__v;

        return data;
    }

    async create(ctx: Context): Promise<ITerm | never> {
        if(!ctx.user) throw new ServiceError('User logged in does not exist', 500);

        return this.ctrl.create(ctx.params, ctx.user)
            .then(model => this.export(model));
    }

    async delete(ctx: Context): Promise<void> {
        return this.ctrl.softDelete(ctx.params.id);
    }

    async evaluate(ctx: Context): Promise<ITerm> {
        return this.ctrl.evaluate(ctx.params.id, ctx.params.evaluate)
            .then(model => this.export(model));
    }

    async getAll(ctx: Context): Promise<ITerm[]> {
        return this.ctrl.getAll(ctx.params.limit, ctx.params.offset)
            .then(result => {
                const data = Object.assign(result);
                data.items = result.items.map( model => this.export(model) );
                return data;
            })
    }

    async getOne(ctx: Context): Promise<ITerm> {
        return this.ctrl.getOne(ctx.params.id)
            .then(model => model ? this.export(model) : model);
    }

    async search(ctx: Context): Promise<ITerm[]> {
        return this.ctrl.search(ctx.params.search ,ctx.params.limit, ctx.params.offset)
            .then(result => {
                const data = Object.assign(result);
                data.items = result.items.map( model => this.export(model) );
                return data;
            })
    }

    async update(ctx: Context): Promise<ITerm> {
        return this.ctrl.update(ctx.params.id, ctx.params)
            .then(model => model ? this.export(model) : model);
    }
}