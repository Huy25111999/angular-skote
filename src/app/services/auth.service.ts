import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostService } from '../SSO/service/post.service';
import { author } from 'src/app/model/author';
import { tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth!:author[];
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false)
  isLoggedIn$ = this._isLoggedIn$.asObservable();
  token;
  username;
  constructor(
    private postService: PostService,
    private http: HttpClient
  ) {
    this.token = localStorage.getItem('auth');
    this._isLoggedIn$.next(!!this.token);

    
   }

  login(auth:author)
  {
    return this.postService.login(auth).pipe(
      tap((response: any) =>{
        localStorage.setItem('auth',`${response.token}`);
        localStorage.setItem('user',`${response.user.username}`)
        this._isLoggedIn$.next(true);
        console.log('----',response.token);
        
      })
    );
    
  }
}

// eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkb3Zhbmh1eSIsImlhdCI6MTY1OTY3NTY0OCwiZXhwIjoxNjU5Njc5MjQ4fQ.No_FcyUnXJDwj5PlzbEtYIJ5VhuDIjsVEKr_vJouS-Eu3ybRICbOdEvj3ecH8PLF6gTDdQz2XyY115JjgdLkbQ