import { AvailableServices, MicroserviceConstructor } from './service/interfaces';
import { APIService } from './service/APIService';
import { ServiceBrokerDefaultFactory as brokerDefault } from './service/factories';
import { UserService } from './service/UserService';

class Services {

  static readonly requestedServices: Array<string> = process.env.SERVICES?.split('|') || [];

  static readonly availableServices: AvailableServices = {
    api: APIService,
    user: UserService
  }
  
  private services: Array<Function> = [];
  
  addService(serviceClass: MicroserviceConstructor) {
    this.services.push(() => (new serviceClass(brokerDefault.getNewInstance())).register());
  }

  start() {
    Services.requestedServices.forEach(service => this.addService(Services.availableServices[service]));
    this.services.forEach(start => start());
  }

}

(new Services).start();