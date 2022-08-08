import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../../../core/services/auth.service';
import { AccountAuthenticationService } from '../../../core/services/account-authentication.service';

import { ActivatedRoute, Router } from '@angular/router';
import { first, tap } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { PostService } from 'src/app/SSO/service/post.service';
import {HttpClient} from "@angular/common/http";
import { AuthService } from 'src/app/services/auth.service';
//----------------
import { TopbarComponent } from 'src/app/layouts/topbar/topbar.component';
import { AuthInterceptor } from 'src/app/SSO/service/AuthInterceptor';

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

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService,
    private authFackservice: AccountAuthenticationService,
    private authService: AuthService,
    private http: HttpClient
    ) { }



  ngOnInit() {
    this.counter ++;
    this.voteSize.emit(this.counter);
    
    this.initForm();
    // this.loginForm = this.formBuilder.group({
    //   username: ['admin', [Validators.required]],
    //   password: ['123456a@', [Validators.required]],
    // });

    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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
      //   this.authFackservice.login(this.f.username.value, this.f.password.value)
      //     .pipe(first())
      //     .subscribe(
      //       data => {
      //         this.router.navigate(['/dashboard']);
      //       },
      //       error => {
      //         this.error = error ? error : '';
      //       });
      }
    
  }

  //--------------------
  formData:FormGroup
  initForm()
  {
    this.formData = new FormGroup({
      username: new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required]),
    });
  }


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

    this.authService.login(formValue).subscribe(data => {  
      console.log('---------token:',data);
      //this.router.navigate(['/management']);
      //location.replace('http://192.168.0.101:8084/sso/management');
      location.replace('SSO/management');
      
    },error =>{
        console.log(error);
        this.message = error ; 
        console.log(this.message);
        return ;
      
    })
  }

}


    // AuthInterceptor.accessToken = data.token;