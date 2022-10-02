import { Document } from "mongoose";
import uuidToHex from "uuid-to-hex";
import { CollectionUtilities } from "../../CollectionUtilities";
import { PresentationOfCollections } from "../../interfaces";
import { UUID_Utilities } from "../../UUID_Utilities";
import { IUser, Statuses, Workspace, WorkspaceType } from "./user-schema";

export class WorkspaceModel {

    async create({name, email}: IUser): Promise<WorkspaceType> {
        const model = new Workspace();
            model.name = name;
            model.email = email;
            model.uuid = Buffer.from( uuidToHex(UUID_Utilities.generateUUIDv5(model._id.toString(), undefined)), 'hex' );
            model.createdAt = new Date;
            model.updatedAt = new Date;
            model.status = Statuses.active;        
        return model.save();
    }

    async softDelete(uuid: string): Promise<WorkspaceType> {
        const model = await this.getOne(uuid);
        if(!model) throw new Error("not_found");
        return model.update({ status: Statuses.inactive });
    }

    async update(uuid: string, {name, email}: IUser): Promise<WorkspaceType|null> {
        const model = await this.getOne(uuid);
        if(!model) return Promise.reject(null);

        if(this.checkDiff(model, {name, email})) {
            await model.update({ name, email, updatedAt: new Date })
        }
        return this.getOne(uuid).then(model => model ? model : Promise.reject(null));
    }

    async getOne(uuid: string): Promise<WorkspaceType|null> {
        return Workspace.findOne({ uuid: UUID_Utilities.uuidToBuffer(uuid), status: Statuses.active })
    }

    async getAll(limit: number, offset: number): Promise<PresentationOfCollections> {
        return CollectionUtilities.find(Workspace, { status: Statuses.active }, limit, offset);
    }

    private checkDiff(model: Document, comp: { [s: string]: unknown; } | ArrayLike<unknown>): boolean {
        const data = <any>model.toJSON();
        for (const [key, value] of Object.entries(comp)) {
            if(value && data[key] !== value) return true;
        }
        return false;
    }

}