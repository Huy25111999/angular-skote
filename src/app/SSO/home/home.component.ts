import { Component, OnInit } from '@angular/core';
import { PostService } from '../service/post.service';
import { infor } from '../../model/infor';
import { FormGroup, FormControl, FormBuilder} from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/filter';  

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user:infor[] = [] ;
  username: string;
  password: string;
  domainCode: string;

  formData : FormGroup =  this.fb.group({
    username : new FormControl(''),
    password : new FormControl(''),
    domainCode : new FormControl('')

  });

  constructor(
    private postService: PostService,
    private fb : FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe(params =>{
      this.domainCode = params['domainCode'];
    })
    
   }


  ngOnInit(): void {
    // this.getParam();
  }
  
  // get param
  getParam()
  {
    this.route.queryParams.subscribe(params =>{
      this.domainCode = params['domainCode'];
    })

    if (!this.domainCode)
    {
        this.warn();
    }
    else
    {
      this.onLogin();
      //  this.rout();
    }

  }
  

  // routing app quiz
  rout()
  {
    window.location.replace('https://www.w3schools.com');
  }


  tickit;

  // Call api
  onLogin() {
    
    if (!this.domainCode)
    {
        this.warn();
    }
    else
    {
      console.log(this.domainCode);
      this.formData.value.domainCode = this.domainCode;
      console.log('------',this.formData.value);

      this.postService.getAuthor({...this.formData.value}).subscribe(data =>{

        console.log('Infor login :------ ',this.formData.value);
        console.log('........',data);

        if(!this.tickit)
        {
          this.warnTickit()
        }
        else{
          this.success();
          this.rout();
        }
  
     },error =>{
      console.log(error);
      
        this.error();
     })
    }

  }



 //Notification

  warn() {
    Swal.fire({
      position: 'top-end',
      icon: 'warning',
      title: 'Không có app code',
      showConfirmButton: false,
      timer: 1500
    });
  }
  
  warnTickit()
  {
    Swal.fire({
      position: 'top-end',
      icon: 'warning',
      title: 'Họ không có quyền',
      showConfirmButton: false,
      timer: 1500
    });
  }
  
  success() {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Đăng nhập thành công',
      showConfirmButton: false,
      timer: 1500
    });
  }

  error() {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'Đăng nhập thât bại',
      showConfirmButton: false,
      timer: 1500
    });
  }
  
}
