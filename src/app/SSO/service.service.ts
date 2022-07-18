import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import {infor} from "../model/infor";
@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  inforUser !: infor[];
  private API: string = "http://192.168.3.41:8080/api/users";
  constructor(private http: HttpClient) { }
  
  getAllUsers():Observable<any>{
    return this.http.get<any>(this.API + '/show-all-question-type')
  }

  getInfo(id: number): Observable<any>{
    return this.http.get<any>(this.API + '/update-question-type/' + id)
  }
}
