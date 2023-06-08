import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/core/models/auth.models';
import { infor } from 'src/app/model/infor';
import { UserService } from '../../service/user.service';
import { NgbModal,NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { GroupRoleService } from '../../service/group-role.service';

@Component({
  selector: 'app-modal-add',
  templateUrl: './modal-add.component.html',
  styleUrls: ['./modal-add.component.scss']
})
export class ModalAddComponent implements OnInit {
  @Input() 
  listUsers : infor[]= [];
  edit:  infor[]= [];
  modalRef: any ;
  submitted = false;
  message: string ; 
  err: boolean = false;
  formData:FormGroup;
  appRole: FormGroup;
  idApp: number;
  idGroupRole: number;

  selectAppId: any[] ;
  selectGroupRole: any[];
  selectGroupRoleId: any [];
  selectStatus: any[];
  selectGender: any=[];

  defaultValue;

  name = '';
  constructor( 
    private fb: FormBuilder,
    private userService: UserService,
    private groupRoleService: GroupRoleService,
    private modalService : NgbModal,
    public activeModal: NgbActiveModal,
    private route:Router,
    ) {
      this.appRole = this.fb.group({
        userAppDto: this.fb.array([]),
      });
    }

  ngOnInit(): void {

    this.selectStatus = [
      {id:1, name:'Kích hoạt', selected: true},
      {id:0, name:'Không kích hoạt'}
    ];
    
    this.selectGender = [
      {id:0, name:'Nữ'},
      {id:1, name:'Nam'}
    ];
    this.defaultValue = 1

    

    this.formData = this.fb.group({
      fullName:['',[Validators.required,Validators.maxLength(100)]],
      username:['',[Validators.required,Validators.maxLength(100)]],
      password:['',[Validators.required,Validators.minLength(6)]],
      // email:['',[Validators.required, Validators.email,  Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      email:['',[Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      active:[null,Validators.required],
      phone:['',[Validators.required, Validators.maxLength(10),Validators.minLength(10), Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      address:[''],
      gender:null,
      position:['',[Validators.required,Validators.maxLength(100)]]
    })
   // Validators.pattern("^[0-9]*$"),
    this.getNameApp();
  }

  addPhone(): FormGroup {
    return this.fb.group({
      userId:'',
      appId: '',
      groupRoleId:''
    });
  }

  get f(){
    return this.formData.controls;
  }

  
  //------------
  appGroupRole(): FormArray {
    return this.appRole.get('userAppDto') as FormArray;
  }
  
  addApp() {
    this.appGroupRole().push(this.addPhone());
  }
  deleteApp(i: number) {
    this.appGroupRole().removeAt(i);
  }

// --- get select
  getNameApp()
  {
    this.userService.getNameApp().subscribe(data => {
    this.selectAppId = data.data;
    }, error => {
      console.log(error);
    })
  }

  nodeApp(event){
    console.log(this.formData.value.appId);
    console.log('Event',event)
    this.idApp = event.id;
    console.log('id app:',this.idApp);

    this.formData.value.userAppDto.appId = this.idApp;
 
 }


 nodeGroupRole(event){
  this.idGroupRole = event.groupRoleId;
  console.log('id app:',this.idGroupRole);
  
  this.formData.value.userAppDto.groupRoleId = this.idGroupRole;

}

 listAppGroupRole()
 {
  console.log('id app----:',this.idApp);
  this.getGroupRole(this.idApp);
 }

  getGroupRole(id)
  {
    this.groupRoleService.getAllGroupRole(id).subscribe(data => {
      this.selectGroupRoleId = data.data;
      console.log('---group role,',this.selectGroupRoleId)
    }, error => {
      console.log(error);
    })
  }


  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
   
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  
  // searchApp()
  // {
  //   console.log(this.formData.value);
  //   this.groupRoleService.getAllApp( this.formData.value).subscribe(data => {
  //     console.log('app',data);
  //   }, error => {
  //     console.log(error);
  //   })
  // }
  
  onSubmit()
  {
     this.message = '' ;
     this.err = false ; 

   //  this.formData.value.userAppDto = this.appRole.value.userAppDto;

    //  this.formData.value.userAppDto[0].appId = this.idApp;
    //  this.formData.value.userAppDto[0].groupRoleId = this.idGroupRole;

     console.log(' this.formdata:', this.formData.value);
     console.log('approle', this.appRole.value);
     this.formData.value.active = parseInt(this.formData.value.active);
     this.formData.value.gender = parseInt(this.formData.value.gender);

     this.userService.addUser(this.formData.value).subscribe(data => {
      console.log(this.listUsers);
      console.log ("submit:",data);
      this.activeModal.dismiss(this.formData.value);
      this.activeModal.close('Close click');  
      this.success();  
      
    }, error => {
      this.err = true ; 
      this.message = error ; 
      console.log(this.message);
      return ;
    })
  }

  success() {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Tạo mới thành công',
      showConfirmButton: false,
      timer: 1500
    });
  }

  error() {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'Tạo mới thất bại',
      showConfirmButton: false,
      timer: 1500
    });
  }

  closeModal(){
    Swal.fire({
      text: 'Dữ liệu nhập chưa được lưu lại, bạn có muốn đóng tab không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText:  'Đồng ý',

    }).then(result => {
      if (result.value) {
          this.activeModal.close('Close click'); 
      }
    });
  }

}
