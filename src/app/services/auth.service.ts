import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from '../SSO/service/user.service';
import { author } from 'src/app/model/author';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthInterceptor } from 'src/app/SSO/service/AuthInterceptor';

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
  apiurl = 'http://192.168.3.41:8224/api/auth/verify-refresh-token';
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
        localStorage.setItem('token',`${response.data.token}`);
        localStorage.setItem('user',`${response.data.username}`);
        
        localStorage.setItem('userId',`${response.data.userId}`);
        this._isLoggedIn$.next(true);
        console.log(response);   
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

  getToken(){
    return localStorage.getItem('token') || '';
  }

  getRefreshToken(){
    return localStorage.getItem('refreshToken') || '';
  }

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

}
