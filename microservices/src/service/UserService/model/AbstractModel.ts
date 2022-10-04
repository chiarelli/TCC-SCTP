import { Document } from "mongoose";
import uuidToHex from "uuid-to-hex";
import { CollectionUtilities } from "../../CollectionUtilities";
import { PresentationOfCollections } from "../../interfaces";
import { UUID_Utilities } from "../../UUID_Utilities";
import { DocumentUserType, IUser, ModelUserType, Statuses } from "./user-schema";

export abstract class AbstractModel {
    constructor(private Model: ModelUserType) {};

    async create(args: IUser): Promise<DocumentUserType> {
        const model = this.prepareCreate(args);
        return model.save();
    }
    
    protected prepareCreate({name, email}: IUser): DocumentUserType {
        const model = new this.Model();
            model.name = name;
            model.email = email;
            model.uuid = Buffer.from( uuidToHex(UUID_Utilities.generateUUIDv5(model._id.toString(), undefined)), 'hex' );
            model.createdAt = new Date;
            model.updatedAt = new Date;
            model.status = Statuses.active; 
        return model;
    }

    async softDelete(uuid: string): Promise<DocumentUserType> {
        const model = await this.getOne(uuid);
        if(!model) throw new Error("not_found");
        return model.update({ status: Statuses.inactive });
    }

    async update(uuid: string, {name, email}: IUser): Promise<DocumentUserType|null> {
        const model = await this.getOne(uuid);
        if(!model) return Promise.reject(null);

        if(this.checkDiff(model, {name, email})) {
            await model.update({ name, email, updatedAt: new Date })
        }
        return this.getOne(uuid).then(model => model ? model : Promise.reject(null));
    }

    async getOne(uuid: string): Promise<DocumentUserType|null> {
        return this.Model.findOne({ uuid: UUID_Utilities.uuidToBuffer(uuid), status: Statuses.active })
    }

    async getAll(limit: number, offset: number): Promise<PresentationOfCollections> {
        return CollectionUtilities.find(this.Model, { status: Statuses.active }, limit, offset);
    }

    protected checkDiff(model: Document, comp: { [s: string]: unknown; } | ArrayLike<unknown>): boolean {
        const data = <any>model.toJSON();
        for (const [key, value] of Object.entries(comp)) {
            if(value && data[key] !== value) return true;
        }
        return false;
    }

}