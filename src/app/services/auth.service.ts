import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from '../SSO/service/user.service';
import { author } from 'src/app/model/author';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
//import * as CryptoJS from 'crypto-js';
//import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth!:author[];
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false)
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  token;
  username;
  loginToken;
  _extractedToken;
  constructor(
    private userService: UserService,
    private http: HttpClient,
    private router:Router
  ) {
    this.token = localStorage.getItem('token');
    console.log('token authservice-----:', this.token);
    this._isLoggedIn$.next(!!this.token)
  
   }

  login(auth:author)
  {
    return this.userService.login(auth).pipe(
      tap((response: any) =>{
        console.log('----',response);
        this._isLoggedIn$.next(true);
        localStorage.setItem('token',`${response.data.token}`);
        localStorage.setItem('user',`${response.data.username}`);
        localStorage.setItem('userId',`${response.data.userId}`);
        location.replace('./user');
        // this.router.navigate(['app/management']);
      })
      
    ); 
  }


  // generateRefreshToken(){
  //   let input = {
  //     'token': this.getToken() ,
  //     'refreshToken': "getRefreshToken"
  //   }
  //   return this.http.post(this.apiurl, input )
  // }

  // getToken(){
  //   return localStorage.getItem('token') || '';
  // }

  // getRefreshToken(){
  //   return localStorage.getItem('refreshToken') || '';
  // }

  isLoggedIn(){
    return localStorage.getItem('token') != null ;
  }

  haveAccess()
  {
    this.loginToken = localStorage.getItem('token') ||'';
    this._extractedToken = this.loginToken.split('.')[1];
    var _atoData = atob(this._extractedToken);
    var _finalData =  JSON.parse(_atoData);
    console.log('_finalData:', _finalData);
    
    if (_finalData.user.position == 'Admin')
    {
      return true;
    }
    alert('Bạn không có quyền truy cập!')
    return false;  
  }  

  logout() {
    // localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    void this.router.navigate(['/account/login']);   
  }



  //------------- login new smartmotor

  readonly SERVER: string = 'http://smartmotor.techasians.com';
  isAuthenticated$ = new BehaviorSubject(false);
  isHadError = new BehaviorSubject<boolean>(false);
  isCaptcha = new BehaviorSubject(false);
  userData: any = null

  
  authenticate(username: string, password: string, captcha: string = '', sessionId: string = ''): Observable<any> {
    return this.http.post<any>(
      `${this.SERVER}/oauth/token?grant_type=password&username=${username}&password=${password}&captcha=${captcha}&sessionId=${sessionId}`, null, {
      headers: {
        Authorization: environment.keyAuthorizationBasic,
       // Authorization: 'Basic ' + 'ZGVtby1jbGllbnQ6ZDE2ZmI4YWZkYTc4Mzk0ZTUwZDg0YmFlMzMxNTJjYWQ=',
      },
    }
    )
  }

  getAccountInfo(token: string): Observable<any> {
    return this.http.get(`${this.SERVER}/manage/account/info`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    });
  }

  reset() {
    // clear localstorage
    localStorage.clear();
    // clear sectionStorage
    sessionStorage.clear();
  }

  // encryptCode() {
  //   let _key = CryptoJS.enc.Utf8.parse('SMARTMOTOR123456');
  //   let _passs = CryptoJS.enc.Utf8.parse('123456a@');
  //   let passwordEncoded = CryptoJS.AES.encrypt(
  //     _passs, _key, {
  //     mode: CryptoJS.mode.ECB,
  //   });
  //   return passwordEncoded.ciphertext.toString(CryptoJS.enc.Hex);
  // }

  checkAuthenticated(): void {
    let storageData = localStorage.getItem('USER_DATA') || sessionStorage.getItem('USER_DATA') || null
    let tokenInfo = localStorage.getItem('TOKEN') || sessionStorage.getItem('TOKEN');
    if (storageData) {
      this.userData = JSON.parse(storageData);
    }
    if (tokenInfo) {
      this.token = JSON.parse(tokenInfo);
      this.checkIsExpired();
      this.isAuthenticated$.next(true);
    } else {
      this.isAuthenticated$.next(false);
      this.router.navigateByUrl('/account/login');
    }
  }

  checkIsExpired(): void {
    // let decoded: any = jwt_decode(this.token.access_token);
    // let newTime = Math.floor(Date.now() / 1000)
    // if (decoded.exp <= newTime) {
    //   this.router.navigateByUrl('/auth/login')
    // }
  }

  refreshToken() {
    const token = this.getToken();
    const rftoken = this.getRefreshToken();
    if (!token) {
      this.reset();
      this.router.navigate(['/account/login']);
      return of(null);
    }
    return this.http.post(`${this.SERVER}/oauth/token?grant_type=refresh_token&refresh_token=${rftoken}`, null, {
      headers: {
        //Authorization: 'Basic ' + 'ZGVtby1jbGllbnQ6ZDE2ZmI4YWZkYTc4Mzk0ZTUwZDg0YmFlMzMxNTJjYWQ=',
        Authorization: environment.keyAuthorizationBasic
      },
      observe: 'response'
    }).pipe(
      map((data: any) => {
        if (data.status === 200) {
          console.log("data--", data);
          
          return data.body;
        }
      })
    );
  }

  getRefreshToken(): string {
    let tokenInfo: any = localStorage.getItem('TOKEN') || sessionStorage.getItem('TOKEN');
    if (tokenInfo) {
      tokenInfo = JSON.parse(tokenInfo);
      return tokenInfo.refresh_token;
    }
    return '';
  }

  getToken(): string {
    let tokenInfo: any = localStorage.getItem('TOKEN') || sessionStorage.getItem('TOKEN');
    if (tokenInfo) {
      tokenInfo = JSON.parse(tokenInfo);
      return tokenInfo.access_token;
    }
    return '';
  }
  getLanguage(): string {
    let lang: string = localStorage.getItem('LANGUAGE') || sessionStorage.getItem('LANGUAGE') || 'vi'
    return lang
  }

  saveToken(token: string) {
    if (token && token !== 'null') {
      sessionStorage.removeItem('TOKEN');
      localStorage.removeItem('TOKEN');

      sessionStorage.setItem('TOKEN', token);
      localStorage.setItem('TOKEN', token);
    }
  }
}
