
import {HTTP_INTERCEPTORS, HttpEvent, HttpHeaders, HttpErrorResponse, HttpClient} from '@angular/common/http';
import {Injectable, Injector} from '@angular/core';
import {HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
// import {} from "./Account.service.";

import {Observable, throwError} from "rxjs";
import { AuthService } from 'src/app/services/auth.service';
import { catchError, switchMap } from 'rxjs/operators';
const TOKEN_HEADER_KEY = 'Authorization';

@Injectable({
  providedIn: 'any',
})
export class AuthInterceptor implements HttpInterceptor {
 // static accessToken = '';
//  accessToken:any ;
  authreq;
  refresh= false;
  constructor(private authService: AuthService,
              private http: HttpClient,
              private inject: Injector
    ) {
  }

  intercept(req:  HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.token;
    console.log("token: ",token);


    if (token) {
      // this.authreq = req;
      // this.authreq = this.addTokenHeader(req,token);
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
     return next.handle(req) ;
    // return next.handle(this.authreq).pipe(catchError(errorData =>{
    //   if (errorData.status === 401)
    //   {
    //     // this.authService.logout();
    //     this.handleRefreshToken(req, next);
    //   }
    //   return throwError(errorData);
    // })) ;
  }

  handleRefreshToken(req:  HttpRequest<any>, next: HttpHandler)
  {

  }

  addTokenHeader(request: HttpRequest<any>,token:any)
  {
    return request.clone({headers:request.headers.set('Authorization','Bearer'+token)});
  }

}

export const httpInterceptorProviders = [
  // {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
];