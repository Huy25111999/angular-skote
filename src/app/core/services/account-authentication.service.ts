import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {User} from '../models/auth.models';
import {ConfigIpService} from "../../config-ip.service";
import {environment} from "../../../environments/environment";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})
export class AccountAuthenticationService {
  private currentUserSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  public currentUser: Observable<User>;

  constructor(private http: HttpClient,
              private configIpService: ConfigIpService,
              private router: Router) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const currentAuthorization = JSON.parse(localStorage.getItem('currentUser'));
    if (currentAuthorization && currentUser) {
      this.currentUserSubject = new BehaviorSubject<User>(currentUser);
      this.currentUser = this.currentUserSubject.asObservable();
    }
  }

  public get currentUserValue(): User {
    return this.currentUserSubject && this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>(`${this.configIpService.getServiceUrl}/auth`, {
      username,
      password
    }, {observe: "body"})
      .pipe(map(userResponse => {
        if (userResponse) {
          if (userResponse.token) {
            localStorage.setItem('authorization', JSON.stringify(userResponse.token));
            if (userResponse.userDTO) {
              const user: any = userResponse.userDTO;
              user.token = userResponse.token;
              localStorage.setItem('currentUser', JSON.stringify(user));
              this.currentUserSubject.next(user);
              return user;
            }
          }
        }
        return null;
      }));
  }

  logout() {
    // localStorage.removeItem('currentUser');
    localStorage.removeItem('auth');
    this.currentUserSubject.next(null);
    void this.router.navigate(['/account/login']);
  }
}
