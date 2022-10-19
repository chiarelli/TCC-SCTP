import { Context } from "../../interfaces";
import { AbsDoc } from "../interfaces";
import { AbstractModel } from "../model/AbstractModel";

export abstract class AbstractController<T> {

    constructor(protected ctrl: AbstractModel<T>) {}

    protected export(model: AbsDoc<T> | null) {
        if(!model) return false;

        const data = <any>model.toJSON();
        data.uuid = model.uuid;

        delete data._id;
        delete data.__v;
        delete data.kind;

        return data;
    }

    async create(ctx: Context) {
        return this.ctrl.create(ctx.params)
            .then(model => this.export(model));
    }

    async delete(ctx: Context) {
        return this.ctrl.softDelete(ctx.params.id);
    }

    async getAll(ctx: Context) {
        return this.ctrl.getAll(ctx.params.limit, ctx.params.offset)
            .then(result => {
                const data = Object.assign(result);
                data.items = result.items.map( model => this.export(model) );
                return data;
            })
    }

    async getOne(ctx: Context) {
        return this.ctrl.getOne(ctx.params.id)
            .then(model => this.export(model));
    }

    async update(ctx: Context) {
        return this.ctrl.update(ctx.params.id, ctx.params)
            .then(model => this.export(model));
    }
}