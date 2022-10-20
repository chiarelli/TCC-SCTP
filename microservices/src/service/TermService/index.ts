import { ServiceBroker } from "moleculer";
import { AuthService } from "../../stub/AuthService";
import { UserService } from "../../stub/UserService";
import { EvaluateStatuses } from "../enums";
import { Context, Microservice } from "../interfaces";
import { connect } from "../mongodb-conn";
import { ListingParams } from "../switchblade";
import { TermController } from "./controller/TermController";
import { TermModel } from "./model/TermModel";

export class TermService implements Microservice {

    public static stubs: {
        authService: AuthService,
        userService: UserService,
    };

    private termCtrl: TermController;

    constructor(private broker: ServiceBroker) {
        if(!TermService.stubs) {
            TermService.stubs = {
                authService: new AuthService(this.broker),
                userService: new UserService(this.broker),
            };
        }
        this.termCtrl = new TermController(new TermModel(TermService.stubs));
    }

    async register(): Promise<void> {
        // Connect MongoDB
        await connect();

        // Define a service
        this.broker.createService({
            name: 'term',

            hooks: {

                before: {
                    "*": (ctx: Context) => ctx.user = ctx.meta.user,
                }

            },

            actions: {

                create: {
                    params: {
                        $$strict: true,
                        name: 'string',
                        question: 'string',
                        description: 'string',
                    },
                    handler: ctx => this.termCtrl.create(ctx)
                },

                update: {
                    params: {
                        $$strict: true,
                        id: 'string',
                        name: 'string',
                        question: 'string',
                        description: 'string',
                    },
                    handler: ctx => this.termCtrl.update(ctx)
                },

                evaluate: {
                    params: {
                        $$strict: true,
                        id: 'string',
                        evaluate: { type: 'enum', values: Object.values(EvaluateStatuses).filter( item => item !== EvaluateStatuses.none ) },
                    },
                    handler: ctx => this.termCtrl.evaluate(ctx)
                },

                delete: {
                    params: {
                        $$strict: true,
                        id: 'string',
                    },
                    handler: ctx => this.termCtrl.delete(ctx)
                },

                get: {
                    params: {
                        $$strict: true,
                        id: 'string',
                    },
                    handler: ctx => this.termCtrl.getOne(ctx)
                },

                getAll: {
                    params: {
                        $$strict: true,
                        ...ListingParams
                    },
                    handler: ctx => this.termCtrl.getAll(ctx)
                },

                search: {
                    params: {
                        $$strict: true,
                        search: 'string|min:3',
                        ...ListingParams
                    },
                    handler: ctx => this.termCtrl.search(ctx)
                },

            }
        });

         // graceful shutdown service
         process.on('SIGINT', async () => {
            console.log(`##### graceful shutdown service ${this.broker.nodeID}`);
            await this.broker.stop();
        });

        // Start the broker
        return this.broker.start();
    }
}