import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostService } from '../SSO/service/post.service';
import { author } from 'src/app/model/author';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

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
    private postService: PostService,
    private http: HttpClient,
    private router:Router
  ) {
    this.token = localStorage.getItem('token');
    this._isLoggedIn$.next(!!this.token)
  
   }

  login(auth:author)
  {
    return this.postService.login(auth).pipe(
      tap((response: any) =>{
        localStorage.setItem('token',`${response.token}`);
        localStorage.setItem('user',`${response.user.username}`);
        this._isLoggedIn$.next(true);
        console.log('----',response.token);
        console.log(response);   
      })
    ); 
  }

  generateRefreshToken(){
    let input = {
      'token': this.getToken() ,
      'refreshToken': "getRefreshToken"
    }
    return this.http.post(this.apiurl, input )
  }

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
    void this.router.navigate(['/account/login']);   
  }

}
