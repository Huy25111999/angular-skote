
import {HTTP_INTERCEPTORS, HttpEvent, HttpHeaders, HttpErrorResponse, HttpClient} from '@angular/common/http';
import {Injectable, Injector} from '@angular/core';
import {HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';
// import {} from "./Account.service.";

import {BehaviorSubject, Observable, throwError} from "rxjs";
import { AuthService } from 'src/app/services/auth.service';
import { catchError, switchMap, filter, take, tap } from 'rxjs/operators';
const TOKEN_HEADER_KEY = 'Authorization';

@Injectable({
  providedIn: 'any',
})
export class AuthInterceptor implements HttpInterceptor {
  authreq;
  refresh= false;
  constructor(private authService: AuthService,
              private http: HttpClient,
              private injector: Injector
    ) {
  }

  intercept(req:  HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem("token");
    // if (token) {
    //   req = req.clone({
    //     setHeaders: {
    //       Authorization: 'Bearer '+ token,
    //       'isSlide': 'true',
    //       'Accept-language': 'vi'
    //     }
    //   });

    // }else{
    //   req = req.clone({
    //     setHeaders:{
    //       'Accept-language': 'vi'   
    //     }
    //   });
    // }

    if(token){
      req = this.addTokenHeader(req, token, 'vi');
    }
     return next.handle(req).pipe(

      // ----Xử lý refresh token

      catchError((errorData: any) =>{
        console.log("errorData", errorData);
        const autherService = this.injector.get(AuthService);

        if (errorData.status === 401) {
          if (this.refreshTokenInProgress) {
            return this.refreshTokenSubject.pipe(
              filter(token => token !== null),
              take(1),
              switchMap((token) => next.handle(this.addTokenHeader(req, token, 'vi')))
            );
          } else {
            this.refreshTokenInProgress = true;
            // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
            this.refreshTokenSubject.next(null);
            this.isCallRefreshToken = true;
            return autherService.refreshToken().pipe(
              tap((token) => { this.isCallRefreshToken = false }),
              switchMap((newToken: any) => {
                this.refreshTokenInProgress = false;
                this.authService.saveToken(JSON.stringify(newToken));
                this.refreshTokenSubject.next(newToken.access_token);
                return next.handle(this.addTokenHeader(req, newToken.access_token, 'vi'));
              })
            )
          }
        }
        return throwError(errorData);
      })
     ) ;

  }

  // Xử lý refresh token
  private isCallRefreshToken = false;
  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private addTokenHeader(request: HttpRequest<any>, token: string, language: any) {
    if (request.headers.has('Authorization') && this.isCallRefreshToken) {
      return request.clone({
        setHeaders: {
          'Accept-Language': language
        }
      })
    }
    return request.clone({
      setHeaders: {
        Authorization: 'Bearer ' + token,
        'Accept-Language': language
      }
    })
  }
}
