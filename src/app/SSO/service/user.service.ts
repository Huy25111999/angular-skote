import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { infor } from '../../model/infor';
import { domain } from 'src/app/model/domain';
import { THeadModule } from 'ng2-smart-table/lib/components/thead/thead.module';
import { author } from 'src/app/model/author';
import { environment } from 'src/environments/environment';
import {omit, pick} from 'lodash';
@Injectable({
  providedIn: 'root'
})

export class UserService {
  user!: infor[];
  main!: domain[];
  auth!:author[];
 private API:string = environment.server ;
  constructor(private http: HttpClient) {}

  // User
  getAllUsers(id): Observable<any> {
    return this.http.get<any>(this.API + '/group-role/get-user/'+id);
  }

  getUserGroupRole(id): Observable<any> {
    return this.http.get<any>(this.API + '/group-role/get-user-of-group-role/'+id);
  }

  connectUserRole(id,req: any):Observable<any> {
    return this.http.put<any>(this.API + '/group-role/manager-user/'+id,req);
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

  search(req:any):Observable<any>
  {
    return  this.http.post<any>(this.API + '/users/search', req);
  }

  deleteUser(id:number):Observable<any>
  {
    return  this.http.delete<any>(this.API + '/users/'+ id);
  }



// Domain
 
  getNameApp():Observable<any>
  {
    return this.http.get<any>(this.API + '/app/get-all');
  }

  getAllDomain():Observable<any>
  {
    return this.http.get<any>(this.API + '/domain');
  }

  addDomain(main:domain):Observable<any>
  {
    return this.http.post<any>(this.API + '/app',main );
  }

  editApp(main:domain):Observable<any>
  {
    return this.http.put<any>(this.API+'/app',main);
  }

  // getDomainByID(id:number)
  // {
  //   return this.http.get<any>(this.API + '/domain/'+id);
  // }

  getAppByID(id:number)
  {
    return this.http.get<any>(this.API + '/app/'+id);
  }

  lockDomain(id:number):Observable<any>
  {
    return this.http.put<any>(this.API +'/app/lock-app/' + id, null );
  }

  unlockDomain(id:number):Observable<any>
  {
    return this.http.put<any>(this.API +'/app/unlock-app/' + id, null );
  }
  searchDomain(paramSearch:any):Observable<any>
  {
    return  this.http.get<any>(this.API + '/app/', {
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
    return this.http.post<any>(this.API +'/auth/sso/sign-in',auth, {headers: headers, observe: 'body'});
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

  // Autocomplate
  getInvoiceTemplate(req?:any): Observable<HttpResponse<any>>{
    const param = pick(req, ['tenantBranchId', 'invoiceName','taxCodeCluster']);
    return this.http.get<[]>(this.API + 'tools/get-invoice-template', {params: param, observe: 'response'})
  }

  getBranchByTenant(taxCode?: any): Observable<HttpResponse<any>>{
    return this.http.get<[]>(
      this.API + '/tenant/get-branch?taxCodeCluster=' + taxCode, {observe: 'response'}
    )
  }

  getProvince(){
    return this.http.get(this.API + '/manage/area/get-list-area', {
      params: {
        parentId: 0,
        type: 1
      }
    })
  }

  getDistrict(parentId: any){
    return this.http.get(this.API + '/manage/area/get-list-area', {
      params: {
        parentId: parentId,
        type: 2
      }
    })
  }
}
