import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private service:AuthService,
    private router: Router
    ){

  }
  canActivate(){
    if(this.service.haveAccess())
       return true;
    else{
      this.router.navigate(['']);
      return false;
    }
  }
  
}
