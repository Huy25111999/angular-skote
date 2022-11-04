import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { app } from 'src/app/model/app';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class GroupRoleService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':'application/json'
    })
  }

  groupRole: any = [];
  // app !: app[];
  constructor(private http: HttpClient
    ) { }
  private API:string = environment.serviceUrl ;

  getAllApp(req ?: any):Observable<any>
  {
    return  this.http.post<any>(this.API + '/app/search',req)
  }

  deleteApp(id:number):Observable<any>
  {
    return  this.http.delete<any>(this.API + '/app/'+ id);
  }

  
  getIdApp(id:number):Observable<any>
  {
    return  this.http.get<any>(this.API + '/app/'+ id);
  }





  private handleError(error: HttpErrorResponse)
  {
    if (error.error instanceof ErrorEvent){
      console.error("A error:",error.error.message);
    }else {
      console.error(
        `Backend return code ${error.status},`+`body was: ${error.error}`
      )
    }

  }


  ///--------- group role
  getAllRole(id:number)
  {
    return this.http.get<any>(this.API + '/group-role/'+id+'/get-role');
  }

  getAllGroupRole(id:number)
  {
    return this.http.get<any>(this.API + '/group-role/'+id+'/get-all');
  }


  searchGroupRole(paramSearch:any):Observable<any>
  {
    return  this.http.get<any>(this.API + '/domain/', {
      params: paramSearch
    });
  }

  addGroupRole(groupRole:any):Observable<any> {
    return this.http.post<any>(this.API + '/group-role',groupRole);
  }


  editGroupRole( id:number, groupRole:any):Observable<any> {
    return this.http.put<any>(this.API + '/group-role/'+id,groupRole);
  }

  getGroupRoleByID(id:number)
  {
    return this.http.get<any>(this.API + '/id/'+id);
  }

}
