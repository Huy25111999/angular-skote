
import {HTTP_INTERCEPTORS, HttpEvent, HttpHeaders, HttpErrorResponse, HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
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
  refresh= false;
  constructor(private authService: AuthService,
              private http: HttpClient
    ) {
  }

  intercept(req:  HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.token;
    console.log("token: ",token);

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
    return next.handle(req) ;
    
    // return next.handle(req).pipe(catchError((err: HttpErrorResponse) =>{
    //   if (err.status === 401 && !this.refresh){
    //     this.refresh = true;
    //      return this.http.post ('http://192.168.3.41:8224/api/auth/verify-refresh-token',{}).pipe(
    //       switchMap((res:any)=>{
    //         const accessToken = this.authService.token;
    //         return next.handle(req.clone({
    //           setHeaders: {
    //             Authorization: 'Bearer '+ accessToken,
    //             'isSlide': 'true',
    //             'Accept-language': 'vi'
    //           }
    //         }));
    //       })
    //   )}
    //   this.refresh = false;
    //   return throwError(() =>err);
    // }));

  }
}

export const httpInterceptorProviders = [
  // {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
];