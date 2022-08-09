import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private service : AuthService,
    private router: Router,
  ){

  }
  canActivate(){
    if (this.service.isLoggedIn()){
      return true;
    }else{
      this.router.navigate(["/account/login"])
        return false;
    }

  }
  
}
