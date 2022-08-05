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

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login component
 */
export class LoginComponent implements OnInit {

  @Input() childMessage = "test";
  child:string="demo" ;
  @Output() voteSize = new EventEmitter();
  counter: number = 0;

  parentMessage: string = "Message from parent";
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
    if (this.formData.invalid){
      return;
    }

    this.authService.login(this.formData.value).subscribe(data => {  
    console.log('---------token:',data);
    this.router.navigate(['/management']);
    })
  }

}

