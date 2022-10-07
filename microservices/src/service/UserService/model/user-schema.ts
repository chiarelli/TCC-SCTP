import { Document, model, Schema, Types } from 'mongoose';
import { AbstractShema } from '../../AbstractShema';
import { Statuses, UserTypes } from '../../enums';
import { IUser } from '../../interfaces';

const config = { discriminatorKey: 'kind' };

export const UserSchema = new Schema<IUser>({
    ...AbstractShema.obj,
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    status: { type: String, required: true, enum: Object.values(Statuses) },
    // tokens: [ AbstractShema.obj.uuid ],
}, config);

export const AbstractUser = model<IUser>('User', UserSchema);

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