import { Document, model, Schema, Types } from 'mongoose';
import { IModel } from '../../interfaces';
import { AbstractShema } from '../../AbstractShema';

const config = { discriminatorKey: 'kind' };

export interface IUser extends IModel {
    name: string,
    email: string,
    status: Statuses,
}

export enum Statuses {
    active = 'active', 
    inactive = 'inactive'
}

export enum UserTypes {
    admin = 'admin',
    workspace = 'workspace',
    consumer = 'consumer',
}

export const UserSchema = new Schema<IUser>({
    ...AbstractShema.obj,
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    status: { type: String, required: true, enum: Object.values(Statuses) },
}, config);

const AbstractUser = model<IUser>('User', UserSchema);

export type ModelUserType = typeof AbstractUser;

export type DocumentUserType = Document<unknown, any, IUser> & IUser;

export type DocumentWorkspaceType = DocumentUserType;

export const Workspace = AbstractUser.discriminator<IUser>(UserTypes.workspace, UserSchema);

export type DocumentAdminType = DocumentUserType;

export const Admin = AbstractUser.discriminator<IUser>(UserTypes.admin, UserSchema);

export interface IConsumer extends IUser {
    workspace: typeof Types.ObjectId,
}

const ConsumerSchema = new Schema<IConsumer>({
    workspace: { ref: 'User', type: Types.ObjectId, required: true }
}, config);

export type DocumentConsumerType = DocumentUserType & IConsumer;

export const Consumer = AbstractUser.discriminator<IConsumer>(UserTypes.consumer, ConsumerSchema);