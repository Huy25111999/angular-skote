import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../../../core/services/auth.service';
import { AccountAuthenticationService } from '../../../core/services/account-authentication.service';

import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, finalize, first, tap } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { UserService } from 'src/app/SSO/service/user.service';
import {HttpClient} from "@angular/common/http";
import { AuthService } from 'src/app/services/auth.service';
//----------------
import { TopbarComponent } from 'src/app/layouts/topbar/topbar.component';
import { BehaviorSubject } from 'rxjs';

import * as CryptoJS from 'crypto-js';
export const STORAGE_KEYS = {
  USER_DATA: 'USER_DATA',
  ROLES: 'ROLES',
  TOKEN: 'TOKEN',
  LANGUAGE: 'LANGUAGE',
  REFRESH_TOKEN: 'REFRESH_TOKEN',
  USER_RANDOM: 'USER_RANDOM',
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login component
 */
export class LoginComponent implements OnInit {

  @Output() voteSize = new EventEmitter();
  counter: number = 0;
  message: string ;
 
  loginForm: FormGroup;
  submitted = false;
  error = '';
  returnUrl: string;
  responsedata: any;

  private _isLoggedIn$ = new BehaviorSubject<boolean>(false)
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  isLoading = false;
  key = 'SMARTMOTOR123456';

  
  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService,
    private authFackservice: AccountAuthenticationService,
    private authService: AuthService,
    private http: HttpClient,
    private userService: UserService,
    ) { }



  ngOnInit() {
    this.counter ++;
    this.voteSize.emit(this.counter);
    
    this.initForm();
    // this.loginForm = this.formBuilder.group({
    //   username: ['admin', [Validators.required]],
    //   password: ['123456a@', [Validators.required]],
    // });

    // login smartMotor
    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
      remember: [true],
      phone: [''],
      enter_captcha_code: ['']
    });


    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    } else {
      this.router.navigate(['/dashboard']);
        this.authFackservice.login(this.f.username.value, this.f.password.value)
          .pipe(first())
          .subscribe(
            data => {
              this.router.navigate(['/dashboard']);
            },
            error => {
              this.error = error ? error : '';
            });
      }
    
  }

  //--------------------
  formData:FormGroup
  initForm()
  {
    this.formData = new FormGroup({
      username: new FormControl(null,[Validators.required]),
      password: new FormControl(null,[Validators.required]),
    });
  }

  get form() { return this.formData.controls; }

  onSubmitLogin()
  {
    this.message = '' ;
    const formValue = this.formData.getRawValue();
    if (!formValue.username || !formValue.username.length){
      this.message = 'Tên đăng nhập không được để trống!';
      return;
    }
    if (!formValue.password || !formValue.password.length){
      this.message = 'Mật khẩu không được để trống!';
      return;
    }

    if (this.formData.valid){
      // this.userService.login(formValue).pipe(
      //   tap((response: any) =>{
      //     localStorage.setItem('token',`${response.data.token}`);
      //     localStorage.setItem('user',`${response.data.username}`);
      //     localStorage.setItem('userId',`${response.data.userId}`);
      //     this._isLoggedIn$.next(true);
      //     this.router.navigate(['app/management']);
      //   })
      // ).subscribe(result =>{
      //   console.log('login', result);
      //   this.router.navigate(['app/management']);
      // },error =>{ 
      //     this.message = 'Tài khoản hoặc mật khẩu không chính xác!' ; 
      //     if(this.form.username.value === 'admin' && this.form.password.value === '123456'){
      //       this.router.navigate(['/dashboard']);
      //       console.log("dm login");
            
      //     }
      //   })



      // this.authService.login(formValue).subscribe(result =>{
      //   if (result != null){
      //     this.responsedata = result;
      //   }
      // },error =>{ 
      //   this.message = error ; 
      //   console.log(this.message);
      //   return ;
      // })




      // login oauth smartMoto
      
      this.isLoading = true;
      let fValue = this.formData.value;
      let _key = CryptoJS.enc.Utf8.parse(this.key);
      let _passs = CryptoJS.enc.Utf8.parse(fValue.password);
      let passwordEncoded = CryptoJS.AES.encrypt(
        _passs, _key, {
        mode: CryptoJS.mode.ECB,
      });
      this.authService.isHadError.next(false);
      this.authService.authenticate('sysadmin', passwordEncoded.ciphertext.toString(CryptoJS.enc.Hex), fValue.enter_captcha_code, '').pipe(
     // this.authService.authenticate('sysadmin', '569f8f143a6d0e6a566365a4a040e69c', fValue.enter_captcha_code, '').pipe(
        tap((val) => this.authSuccess(val, fValue.remember)),
        concatMap((res) =>
          this.authService.getAccountInfo(res.access_token).pipe(
            finalize(() => this.isLoading = false)
          )
        ),
      ).subscribe({
        next: (res) => {
          if (res) {
            this.authService.isAuthenticated$.next(true);
            // if (fValue.remember) {
            //   localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(res.data));
            // } else {
            //   sessionStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(res.data));
            // }

            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(res.data));
            sessionStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(res.data));

            this.router.navigate(['/']);
            this.isLoading = false;
            this.authService.isCaptcha.next(false);
            this.authService.isHadError.next(false);
          }
        },
        error: (e) => {
          console.log("e--", e);
          this.isLoading = false;
          if (e.error.code === '411') {
            console.log('411');
            
          }
          if(this.authService.isCaptcha.getValue()){
            this.authService.isCaptcha.next(true);
          }
          this.form.controls['enter_captcha_code'].reset('');
          this.authService.reset();
          
        }
      })
    }
  }

  authSuccess(token: any, isRememberMe: boolean = false) {
    if (isRememberMe) {
      sessionStorage.clear();
      localStorage.setItem(STORAGE_KEYS.TOKEN, JSON.stringify(token))
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, 'vi')
    } else {
      localStorage.clear();
      sessionStorage.setItem(STORAGE_KEYS.TOKEN, JSON.stringify(token))
      sessionStorage.setItem(STORAGE_KEYS.LANGUAGE, 'vi')
    }
  }


}
