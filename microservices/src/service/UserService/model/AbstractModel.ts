import { Document, Model } from "mongoose";
import uuidToHex from "uuid-to-hex";
import { CollectionUtilities } from "../../CollectionUtilities";
import { PresentationOfCollections } from "../../interfaces";
import { UUID_Utilities } from "../../UUID_Utilities";
import { AbsDoc } from "../interfaces";
import { DocumentUserType, IUser, Statuses } from "./user-schema";


export abstract class AbstractModel<T> {
    constructor(private Model: Model<T>) {};

    async create(args: IUser): Promise<AbsDoc<T>> {
        const model = this.prepareCreate(args);
        return model.save();
    }

    protected  prepareCreate({name, email}: IUser): AbsDoc<T> {
        const model = <any>new this.Model();
            model.name = name;
            model.email = email;
            model.uuid = Buffer.from( uuidToHex(UUID_Utilities.generateUUIDv5(model._id.toString(), undefined)), 'hex' );
            model.createdAt = new Date;
            model.updatedAt = new Date;
            model.status = Statuses.active; 
        return <AbsDoc<T>>model;
    }

    async softDelete(uuid: string): Promise<AbsDoc<T>> {
        const model = await this.getOne(uuid);
        if(!model) return Promise.reject(new Error("not_found"));
        return model.update({ status: Statuses.inactive });
    }

    async update(uuid: string, args: IUser): Promise<AbsDoc<T> | null> {
        const { name, email } = args;
        const model = await this.getOne(uuid);
        if(!model) return Promise.reject(new Error("not_found"));
        
        const comp = new this.Model(Object.assign( {}, model.toObject(), args ) );
        let isEquals = true;
               
        Object.entries(model.toObject()).forEach(([key, value]) => {
            let obj = <any>comp.toObject();
            let data = <any>value;

            if( obj[key] != data?.toString() ) {
                isEquals = false;
                return isEquals;
            }
        });

        if( !isEquals ) await model.update({ ...args, updatedAt: new Date });

        return this.getOne(uuid).then(model => model ? model : Promise.reject(null));
    }

    async getOne(uuid: string): Promise<AbsDoc<T> | null> {
        return this.Model.findOne({ uuid: UUID_Utilities.uuidToBuffer(uuid), status: Statuses.active })
    }

    async getAll(limit: number, offset: number): Promise<PresentationOfCollections<AbsDoc<T>>> {
        return CollectionUtilities.find(this.Model, { status: Statuses.active }, limit, offset);
    }

}