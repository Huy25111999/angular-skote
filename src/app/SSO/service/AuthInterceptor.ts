
import {HTTP_INTERCEPTORS, HttpEvent, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
// import {} from "./Account.service.";

import {Observable} from "rxjs";
import { AuthService } from 'src/app/services/auth.service';
const TOKEN_HEADER_KEY = 'Authorization';

@Injectable({
  providedIn: 'any',
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(req:  HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.token;
    console.log("aaaaaa: ",token);
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer '+ token,
          'isSlide': 'true',
          'Accept-language': 'vi'
        }
      });
    }else{
      req = req.clone({
        setHeaders:{
          'Accept-language': 'vi'
        }
      });
    }
    return next.handle(req);
  }
}

export const httpInterceptorProviders = [
  // {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
];