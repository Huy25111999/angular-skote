import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

export class ConfigIP {
  serviceUrl: any;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigIpService extends ConfigIP {

  constructor(private http: HttpClient) {
    super();
  }

  loadConfig() {
    return this.http.get('./assets/configs/server-ip.json').toPromise().then((data: any) => {
      this.serviceUrl = data.serviceUrl;
    })
  }

  get getServiceUrl(): string {
    return this.serviceUrl;
  }
}
