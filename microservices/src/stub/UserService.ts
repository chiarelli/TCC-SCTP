import { ServiceBroker } from "moleculer";
import { IUser } from "../service/interfaces";

export class UserService {
    constructor(private broker: ServiceBroker) {}

    async getOneUser(uuid: string): Promise<IUser | never> {
        return this.broker.call('user.getUser', {uuid});
    }
}