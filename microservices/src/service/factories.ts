import { LogLevels, ServiceBroker } from "moleculer";

export class ServiceBrokerDefaultFactory {

    static getNewInstance(): ServiceBroker {
        return new ServiceBroker({
            namespace: process.env.NAMESPACE || '',
            nodeID: `${process.env.NODEID}-${process.env.HOSTNAME}`,
            transporter: process.env.TRANSPORTER || '',
            serializer: process.env.SERIALIZER || '',
            logLevel: <LogLevels>(process.env.LOGLEVEL || ''),
            requestTimeout: 5 * 1000,
            tracking: {
                enabled: true,
            }
        });
    }
    
}