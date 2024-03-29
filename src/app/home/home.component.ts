import {Component, OnInit} from '@angular/core';
import {UserService} from '../SSO/service/user.service';
import {infor} from '../model/infor';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: infor[] = [];
  username: string;
  password: string;
  domainCode: string;
  service: string;
  count:number = 0;
  formData: FormGroup = this.fb.group({
    username: new FormControl(''),
    password: new FormControl(''),
    domainCode: new FormControl('')

  });
  message = '';
  year: number = new Date().getFullYear();
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe(params => {
      if (params) {
        this.service = params.service;
        this.formData.get('domainCode').setValue(params.domainCode);

      }
    })

  }


  ngOnInit(): void {
  }

  onLogin() {
    this.message = '';
    const formValue = this.formData.getRawValue();
    if (!formValue.username || !formValue.username.length) {
      this.message = 'Tên đăng nhập không được để trống!';
      return;
    }
    if (!formValue.password || !formValue.password.length) {
      this.message = 'Mật khẩu không được để trống!';
      return;
    }
    this.userService.getAuthor(formValue).subscribe(res =>{
      if(res && res.token && res.token.length){
        const service = this.service + `?token=${res.token}`
        location.replace(service);
      }
    }, error => {
      this.count +=1; 
      console.log(error);
      
      if(this.count >= 5)
      {
        console.log(this.count);
        this.message = 'Tài khoản của bạn đã bị khóa do nhập sai quá 5 lần ';
        return ;
      }else
      {
        this.message = error ; 
        console.log(this.message);
        return ;
      }
    })
  }


}
