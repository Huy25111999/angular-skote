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
        localStorage.setItem('auth',`Bearer ${response.token}`);
        this._isLoggedIn$.next(true);
        console.log('----',response.token);
        
      })
    );
  }

}


// Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkb3Zhbmh1eSIsImF1dGhvcml0aWVzIjpbXSwiaWF0IjoxNjU5NTE0ODQyLCJleHAiOjE2NTk1ODk5NDB9.LuiIUHmGgClUIq7OzYP-oDkQfumlkPBgrtXabsGZT0PPWEZbrBEaFN2XkHIJz3fkl9Rd1r66GD6uVIjxmlO6OQ

// Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkb3Zhbmh1eSIsImF1dGhvcml0aWVzIjpbXSwiaWF0IjoxNjU5NTE0NzgyLCJleHAiOjE2NTk1ODk4ODB9.DZ0oj3J831zxt6sQJiMiINk80xcodeKlWRvyRHvVRC4cQYSUJ-Gr6Dg-N6-lhMKCcJtyEHIFuXNf5EDp_Ssxmg
//Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkb3Zhbmh1eSIsImF1dGhvcml0aWVzIjpbXSwiaWF0IjoxNjU5NTE0ODQyLCJleHAiOjE2NTk1ODk5NDB9.LuiIUHmGgClUIq7OzYP-oDkQfumlkPBgrtXabsGZT0PPWEZbrBEaFN2XkHIJz3fkl9Rd1r66GD6uVIjxmlO6OQ