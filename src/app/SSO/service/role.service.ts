import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RoleService {

  role: any;
  constructor(private http: HttpClient) { }

 private API:string = environment.serviceUrl ;
  // Role
  searchRole(paramSearch:any):Observable<any>
  {
    return  this.http.get<any>(this.API + '/role/search', {
      params: paramSearch
    });
  }
// --------------
  addRole(role:any):Observable<any> {
    return this.http.post<any>(this.API + '/role',role);
  }


  editRole(role:any):Observable<any>
  {
    return this.http.put<any>(this.API+'/role',role);
  }

  getAllRole(id:number)
  {
    return this.http.get<any>(this.API + '/role/'+id+'/get-all');
  }


  //-------
  getRoleByID(id:number)
  {
    return this.http.get<any>(this.API + '/id/'+id);
  }


  getAllParamID():Observable<any>
  {
    return this.http.get<any>(this.API + '/role/system/get-all');
  }

 
  getRole():Observable<any>
  {
    return this.http.get<any>(this.API + '/group-role/get-role');
  }
}
