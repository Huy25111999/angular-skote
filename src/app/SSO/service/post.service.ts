import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { infor } from '../../model/infor';
import { domain } from 'src/app/model/domain';
import { THeadModule } from 'ng2-smart-table/lib/components/thead/thead.module';
import { author } from 'src/app/model/author';

@Injectable({
  providedIn: 'root'
})

export class PostService {
  user!: infor[];
  main!: domain[];
  auth!:author[];
  private API:string = "http://192.168.0.101:8224/api" ;
  //private API:string = "http://192.168.3.41:8224/api" ;
  constructor(private http: HttpClient) {}

  // User
  getAllUsers(): Observable<any> {
    return this.http.get<any>(this.API + '/users');
  }


  addUser(user:infor):Observable<any> {
    return this.http.post<any>(this.API + '/users',user);
  }


  getID(id:number)
  {
    return this.http.get<any>(this.API + '/users/'+id);
  }


  editUser(user:infor):Observable<any>
  {
    return this.http.put<any>(this.API + '/users',user);
  }

  lockUser(id:number):Observable<any>
  {
    return this.http.put<any>(this.API +'/users/lock-user/' + id, null );
  }

  unlockUser(id:number):Observable<any>
  {
    return this.http.put<any>(this.API +'/users/unlock-user/' + id, null );
  }

  search(paramSearch:any):Observable<any>
  {
    return  this.http.get<any>(this.API + '/users/', {
      params: paramSearch
    });
  }

// Domain
  getAllDomain():Observable<any>
  {
    return this.http.get<any>(this.API + '/domain');
  }

  addDomain(main:domain):Observable<any>
  {
    return this.http.post<any>(this.API + '/domain',main );
  }

  editDomain(main:domain):Observable<any>
  {
    return this.http.put<any>(this.API+'/domain',main);
  }

  getDomainByID(id:number)
  {
    return this.http.get<any>(this.API + '/domain/'+id);
  }

  lockDomain(id:number):Observable<any>
  {
    return this.http.put<any>(this.API +'/domain/lock-domain/' + id, null );
  }

  unlockDomain(id:number):Observable<any>
  {
    return this.http.put<any>(this.API +'/domain/unlock-domain/' + id, null );
  }
  searchDomain(paramSearch:any):Observable<any>
  {
    return  this.http.get<any>(this.API + '/domain/', {
      params: paramSearch
    });
  }

  //Author
  // Xác thực
  getAuthor(auth:author):Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/text')
    return this.http.post<any>(this.API +'/auth/signin',auth, {headers: headers, observe: 'body'});
  }

// login
  login(auth:author):Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/text')
    return this.http.post<any>(this.API +'/auth/sso/signin',auth, {headers: headers, observe: 'body'});
  }

  // User-domain join
  getUserDomain(id:number)
  {
    return this.http.get<any>(this.API + '/user-domain/'+id);
  }

  getListUserDomainJoin(id:number)
  {
    return this.http.get<any>(this.API + '/user-domain/join-domain/'+id);
  }


  updateListUserDomainJoin(id:number,domainId:any)
  {
    return this.http.post<any>(this.API + '/user-domain/'+id,domainId);

  }

  deleteListUserDomainJoin(id:number,domainId:any): Observable<any>
  {
    return this.http.post<any>(this.API + '/user-domain/update/'+id,domainId);

  }
}
