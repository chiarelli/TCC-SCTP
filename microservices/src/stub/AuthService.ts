import { ServiceBroker } from "moleculer";
import { Capabilities } from "../service/interfaces";

/**
 * Classe stub de AuthService
 */
export class AuthService {

    constructor(private broker: ServiceBroker) {}

    async checkPermission(cap: Capabilities): Promise<boolean> {
        return this.broker.call('auth.checkPermission', cap);
    }

}