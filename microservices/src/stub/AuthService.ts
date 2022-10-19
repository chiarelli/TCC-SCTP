import { ServiceBroker } from "moleculer";
import { Capabilities, IToken, ResultDelete } from "../service/interfaces";

/**
 * Classe stub de AuthService
 */
export class AuthService {

    constructor(private broker: ServiceBroker) {}

    async checkPermission(cap: Capabilities): Promise<boolean> {
        return this.broker.call('auth.checkPermission', cap);
    }

    async checkTokenValid(token: string): Promise<IToken | never> {
        return this.broker.call('auth.checkTokenValid', {token});
    }

    async createToken({ owner }: Partial<IToken>): Promise<IToken> {
        return this.broker.call('auth.createToken', { owner });
    }

    async deleteOwnerTokens({ owner }: Partial<IToken>): Promise<ResultDelete> {
        return this.broker.call('auth.deleteOwnerTokens', { owner });
    }
}