import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../../../core/services/auth.service';
import { AccountAuthenticationService } from '../../../core/services/account-authentication.service';

import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login component
 */
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  error = '';
  returnUrl: string;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService,
    private authFackservice: AccountAuthenticationService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['admin', [Validators.required]],
      password: ['123456a@', [Validators.required]],
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
}
