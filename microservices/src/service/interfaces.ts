import { Context as BaseContext, GenericObject, ServiceBroker } from "moleculer";
import { SortOrder, Types } from "mongoose";
import { EvaluateStatuses, Statuses, UserTypes } from "./enums";

export interface Microservice {
    register(): Promise<void>;
}

export type MicroserviceConstructor = new(broker: ServiceBroker) => Microservice;

export type AvailableServices = {
    [key: string]: MicroserviceConstructor
}

export interface IModel {
    _id: Types.ObjectId;
    uuid: Buffer | string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IResource extends IModel {
    status: Statuses,
}

export interface IUser extends IResource {
    name: string,
    email: string,
    kind: UserTypes,
}

export interface IConsumer extends IUser {
    workspace: typeof Types.ObjectId,
}

export interface IToken extends IModel {
    hash: string;
    owner: Buffer | string;
    _token?: string;
}

export interface ITerm extends IResource {
    author: Buffer,
    slug: string,
    name: string,
    question: string,
    description: string,
    evaluate: EvaluateStatuses,
}

export type Context = BaseContext<any, any, GenericObject> & { user?: IUser }

export type Sort = { [key: string]: SortOrder | { $meta: 'textScore' } }

export type PresentationOfCollections<T> = {
    offset: number;
    limit: number;
    query_total: number;
    length: number;
    items: T[];
};

export type Actions = {
    name: 'createOwn' | 'readOwn' | 'updateOwn' | 'deleteOwn' | 'createAny' | 'readAny' | 'updateAny' | 'deleteAny',
    resource: string,
}

export type Capabilities = {
    role: string,
    actions: Actions | Actions[],
    relation?: 'AND' | 'OR'
}

export type Permission = {
    action: string,
    loggedIn?: IUser,
    params: {
        [key: string]: string|number|boolean
    }
}

export type ResultDelete = { acknowledged: boolean, deletedCount: number };