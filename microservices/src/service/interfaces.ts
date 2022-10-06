import { Context as BaseContext, GenericObject, ServiceBroker } from "moleculer";
import { SortOrder, Types } from "mongoose";
import { Statuses, UserTypes } from "./enums";

export interface Microservice {
    register(): Promise<void>;
}

export type MicroserviceConstructor = new(broker: ServiceBroker) => Microservice;

export type AvailableServices = {
    [key: string]: MicroserviceConstructor
}

export interface IUser extends IModel {
    name: string,
    email: string,
    status: Statuses,
    kind: UserTypes,
}

export type Context = BaseContext<any, any, GenericObject> & { user?: IUser }

export interface IModel {
    _id: Types.ObjectId;
    uuid: Buffer | string;
    createdAt: Date;
    updatedAt: Date;
}

export type Sort = { [key: string]: SortOrder | { $meta: 'textScore' } }

export type PresentationOfCollections<T> = {
    offset: number;
    limit: number;
    query_total: number;
    length: number;
    items: T[];
};

type Actions = 'createOwn' | 'readOwn' | 'updateOwn' | 'deleteOwn' | 'createAny' | 'readAny' | 'updateAny' | 'deleteAny';

export type Capabilities = {
    role: string,
    actions: Actions | Actions[],
    resource: string,
    relation?: 'AND' | 'OR'
}