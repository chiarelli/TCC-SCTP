import bcryptjs from "bcryptjs";
import generator from 'generate-password';
import uuidToHex from 'uuid-to-hex';
import { Token, DocumentTokenType } from "./token-schema";
import { UUID_Utilities } from "../../UUID_Utilities";
import { IToken } from "../../interfaces";

const TOKEN_MAX = parseInt(new String(process.env.TOKEN_MAX).toString() || '74');
const TOKEN_MIN = parseInt(new String(process.env.TOKEN_MIN).toString() || '71');

export class TokenModel {
    static generatePassword(min: number, max: number) {
        return generator.generate({
            length: Math.random() * (max - min) + min,
            numbers: true
        });
    }

    static generateToken(plain_text: string): Promise<string> {
        let salt = bcryptjs.genSaltSync( Math.round( getRandomArbitrary(8,10) ) );
        return bcryptjs.hash( plain_text, salt );
    }

    static getRandomArbitrary(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    async create({ owner }: Partial<IToken>): Promise<DocumentTokenType> {
        const plain_text = generatePassword(TOKEN_MAX, TOKEN_MIN);
        const token = new Token;
        const uuid = uuidToHex(UUID_Utilities.generateUUIDv5(token._id.toString(), undefined));

            token.uuid = Buffer.from( uuid, 'hex' );
            token.createdAt = new Date;
            token.updatedAt = new Date;
            token.hash = await TokenModel.generateToken(plain_text);
            token._token = `${uuid}.${plain_text}`;
            owner instanceof Buffer ? token.owner = owner : null;
        return token.save();
    }

    async deleteOwnerTokens(owner: Buffer) {
        return Token.deleteMany({ owner });
    }

    async getOne(token_uuid: string): Promise<DocumentTokenType|null> {
        return Token.findOne({'uuid': UUID_Utilities.uuidToBuffer(token_uuid) });
    }

    async hardDelete(token_uuid: string) {
        return Token.findOneAndDelete({'uuid': UUID_Utilities.uuidToBuffer(token_uuid) });
    }

    async valid(token: string): Promise<DocumentTokenType|false> {
        const [uuid, text] = token.split('.');
        const auth = await this.getOne(uuid);

        if(!auth || !await bcryptjs.compare(text || '', auth && auth.hash || '')) return false;

        return auth;
    }
}

// Funções candidatas à refatoração para um script externo.
const getRandomArbitrary = TokenModel.getRandomArbitrary;
const generatePassword = TokenModel.generatePassword;