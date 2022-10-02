import { Context as BaseContext, GenericObject, ServiceBroker } from "moleculer";
import { Model, SortOrder, Types } from "mongoose";

export interface Microservice {
    register(): Promise<void>;
}

export type MicroserviceConstructor = new(broker: ServiceBroker) => Microservice;

export type AvailableServices = {
    [key: string]: MicroserviceConstructor
}

export type Context = BaseContext<any, any, GenericObject>

export interface IModel {
    _id: Types.ObjectId;
    uuid: Buffer | string;
    createdAt: Date;
    updatedAt: Date;
}

export type Sort = { [key: string]: SortOrder | { $meta: 'textScore' } }

export type PresentationOfCollections = {
    offset: number;
    limit: number;
    query_total: number;
    length: number;
    items: Model<any, {}, {}, {}, any>[];
};