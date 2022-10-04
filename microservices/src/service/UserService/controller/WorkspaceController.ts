import { Context } from "../../interfaces";
import { DocumentUserType } from "../model/user-schema";
import { WorkspaceModel } from "../model/WokspaceModel";

export class WorkspaceController {

    constructor(private ctrl: WorkspaceModel) {}

    async create(ctx: Context) {
        return this.ctrl.create(ctx.params)
            .then(model => this.export(model));
    }

    async update(ctx: Context) {
        return this.ctrl.update(ctx.params.id, ctx.params)
            .then(model => this.export(model));
    }

    async delete(ctx: Context) {
        return this.ctrl.softDelete(ctx.params.id);
    }

    async getAll(ctx: Context) {
        return this.ctrl.getAll(ctx.params.limit, ctx.params.offset)
            .then(result => {
                result.items = result.items.map( model => this.export(<DocumentUserType>model) );
                return result;
            })
    }

    async getOne(ctx: Context) {
        return this.ctrl.getOne(ctx.params.id)
            .then(model => this.export(model));
    }

    private export(model: DocumentUserType|null) {
        if(!model) return false;

        const data = <any>model.toJSON();
        data.uuid = model.uuid;

        delete data._id;
        delete data.__v;
        delete data.kind;

        return data;
    }

}