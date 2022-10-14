import { AvailableServices, MicroserviceConstructor } from './service/interfaces';
import { APIService } from './service/APIService';
import { ServiceBrokerDefaultFactory } from './service/factories';
import { UserService } from './service/UserService';
import { AuthService } from './service/AuthService';

class Services {

  private static readonly requestedServices: Array<string> = process.env.SERVICES?.split('|') || [];

  private static readonly getBroker = ServiceBrokerDefaultFactory.getNewInstance;

  private static readonly availableServices: AvailableServices = {
    api: APIService,
    user: UserService,
    auth: AuthService,
  }

  private services: Array<Function> = [];

  addService(serviceClass: MicroserviceConstructor) {
    this.services.push(() => (new serviceClass(Services.getBroker())).register());
  }

  start() {
    Services.requestedServices.forEach(service => this.addService(Services.availableServices[service]));
    this.services.forEach(start => start());
  }

}

(new Services).start();