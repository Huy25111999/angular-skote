import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/SSO/service/user.service';
import Swal from 'sweetalert2';

import { revenueBarChart, statData } from './data';

import { ChartType } from './profile.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

/**
 * Contacts-profile component
 */
export class ProfileComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>;

  revenueBarChart: ChartType;
  statData;
  inforUser: any;
  userId: any;
  username;
  email;
  address;
  phone;
  gender;
  appName;
  groupRole;
  fullName;
  status;
  createdTime;
  position ; 

  isCreateByOther: any = false;
  selectStatus: any[];
  selectGender: any=[];

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Contacts' }, { label: 'Profile', active: true }];
    this.selectStatus = [
      {id:1, name:'Kích hoạt', active: true},
      {id:0, name:'Không kích hoạt'}
    ];
    this.selectGender = [
      {id:1, name:'Nam', active: true},
      {id:0, name:'Nữ'}
    ];
    
    this.getInforUser();
    // fetches the data
    this._fetchData();
  }

  /**
   * Fetches the data
   */
  private _fetchData() {
    this.revenueBarChart = revenueBarChart;
    this.statData = statData;
  }

  editForm: FormGroup = this.fb.group({
    fullName:['',[Validators.required,Validators.maxLength(100)]],
    username:['',[Validators.required,Validators.maxLength(100)]],
    password:['',[Validators.required,Validators.minLength(6)]],
    email:['',[Validators.required, Validators.email]],
    phone:['',[Validators.required, Validators.maxLength(10), Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
    address:['',[Validators.required, Validators.maxLength(100)]],
    gender:null,
    position:['',[Validators.maxLength(10)]],
    active: [null],
    userId: null,

  })

  get f(){
    return this.editForm.controls;
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
   
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onSubmit() {
    this.editForm.value.gender = parseInt(this.editForm.value.gender);
    this.editForm.value.active = parseInt(this.editForm.value.active);
    
   // this.editForm.value.userAppDto = this.appRole.value.userAppDto;
    console.log('value form:',this.editForm.value)

    this.userService.editUser(this.editForm.value).subscribe(data => {
    console.log('data edit:',data ) ;
    this.success();
    // this.route.navigate(['/detail/{{this.dtUser.id}}']) ;
    }, error => {
      console.log(error);
      this.error();
    })

  }

  success() {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Sửa người dùng thành công',
      showConfirmButton: false,
      timer: 1500
    });
  }

  error() {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'Sửa người dùng thất bại',
      showConfirmButton: false,
      timer: 1500
    });
  }

  getInforUser(){
    this.userId = localStorage.getItem('userId');
    this.userService.getID(this.userId).subscribe(data => {
      console.log(data);
      this.inforUser = data.data;
      console.log("Id edit: ",this.inforUser);
      if (this.inforUser.createBy == "other")
      {
          this.isCreateByOther = true ; 
      }
      this.editForm.patchValue(this.inforUser);

      this.username = this.inforUser.username;
      this.email = this.inforUser.email;
      this.address = this.inforUser.address;
      this.phone = this.inforUser.phone ;
      this.gender = this.inforUser.gender ; 
      this.appName= this.inforUser.appName;
      this.groupRole = this.inforUser.groupRole;
      this.fullName = this.inforUser.fullName;
      this.status = this.inforUser.status;
      this.createdTime = this.inforUser.createdTime;
      this.position = this.inforUser.position;
      // if (this.inforUser.createdBy == "other")
      // {
      //     this.isCreateByOther = true ; 
      // }

      // this.editForm.patchValue(data.data);


      // this.inforRoleUser = data.data.userAppDto;
      // console.log("infor RoleUser: ",this.inforRoleUser);
      // this.appRole.patchValue( this.inforRoleUser);
      
      // console.log("-----:", this.editForm, this.dtUser.id)

    }, error => {
      console.log(error);

    })
    
  }

}
