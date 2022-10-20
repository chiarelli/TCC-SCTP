import { AvailableServices, MicroserviceConstructor } from './service/interfaces';
import { APIService } from './service/APIService';
import { ServiceBrokerDefaultFactory } from './service/factories';
import { UserService } from './service/UserService';
import { AuthService } from './service/AuthService';
import { TermService } from './service/TermService';

class Services {

  private static readonly requestedServices: Array<string> = process.env.SERVICES?.split('|') || [];

  private static readonly brokerFactory = ServiceBrokerDefaultFactory;

  private static readonly availableServices: AvailableServices = {
    api: APIService,
    user: UserService,
    auth: AuthService,
    term: TermService,
  }

  private services: Array<Function> = [];

  addService(serviceClass: MicroserviceConstructor, nodeID: string) {
    this.services.push(() => (new serviceClass(Services.brokerFactory.getNewInstance(nodeID))).register());
  }

  start() {
    Services.requestedServices.forEach(service => this.addService(Services.availableServices[service], service));
    this.services.forEach(start => start());
  }

}

(new Services).start();