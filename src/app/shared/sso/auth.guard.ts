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
    // --------------guard sso
    // if (this.service.isLoggedIn()){
    //   return true;
    // }else{
    //   this.router.navigate(["/account/login"])
    //     return false;
    // }

    // --------------guard smartmotor
    let storageData: any = localStorage.getItem('USER_DATA') || sessionStorage.getItem('USER_DATA');
    let token: any = localStorage.getItem('TOKEN') || sessionStorage.getItem('TOKEN');
    if (token && storageData) {
      this.service.isAuthenticated$.next(true);
      return true;
    }
    // this.router.navigate([`${ROUTERS.AUTH}/${ROUTERS.LOGIN}`]);
    this.router.navigate(["/account/login"]);
    return false;

  }
  
}
