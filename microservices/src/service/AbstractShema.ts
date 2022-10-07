import hexToUuid from 'hex-to-uuid';
import { Schema } from "mongoose";
import { IModel } from './interfaces';

export const AbstractShema = new Schema<IModel>({
    uuid: { type: Buffer, immutable: true, unique: true, required: true,

        get: (buffer: Buffer) => hexToUuid( buffer.toString('hex') )
    },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, default: Date.now, required: true },
});