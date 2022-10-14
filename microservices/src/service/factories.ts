import { LogLevels, ServiceBroker } from "moleculer";

export class ServiceBrokerDefaultFactory {

    static getNewInstance(): ServiceBroker {
        return new ServiceBroker({
            namespace: process.env.NAMESPACE || '',
            nodeID: `${process.env.NODEID}-${process.env.HOSTNAME}`,
            transporter: process.env.TRANSPORTER || '',
            serializer: process.env.SERIALIZER || '',
            logLevel: <LogLevels>(process.env.LOGLEVEL || ''),
            cacher: {
                type: "MemoryLRU",
                options: {
                    // Maximum items
                    max: 100,
                    // Time-to-Live
                    // ttl: 3
                    // Max params length
                    maxParamsLength: 60
                }
            },
            requestTimeout: 2 * 1000,
            // hotReload: true,
            tracking: {
                enabled: true,
            },
            // heartbeatTimeout: 50,
            // heartbeatInterval: 20,
            dependencyInterval: 100,
            retryPolicy: {
                enabled: true,
                retries: 5,
                delay: 100,
                maxDelay: 2*1000,
                factor: 2,
                // @ts-ignore: Unreachable code error
                check: err => err && !!err.retryable
            }
        });
    }

}