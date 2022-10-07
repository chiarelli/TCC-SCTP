import hexToUuid from "hex-to-uuid";
import { Document, model, Schema } from "mongoose";
import { AbstractShema } from '../../AbstractShema';
import { IToken } from "../../interfaces";

export type TokenModelType = Document<unknown, any, IToken> & IToken;

export const TokenSchema = new Schema<IToken>({
    ...AbstractShema.obj,

    hash: { type: String, required: true, validate: { validator: hashBcrypt } },
    owner: { type: Buffer, immutable: true, required: true,

        get: (buffer: Buffer) => hexToUuid( buffer.toString('hex') )
    }
});

TokenSchema.virtual('token').get(function() {
    return this._token;
});

export const Token = model<IToken>('Token', TokenSchema);

/* Funções auxiliares */
function hashBcrypt(hash: string) {
    var patt = /^\$2[ayb]\$.{56}$/;

    if( ! patt.test( hash ) )
        return false;

    var int = parseInt( hash.split('$')[2] );

    if( int < 1 || int > 31 )
        return false;

    return true;
}