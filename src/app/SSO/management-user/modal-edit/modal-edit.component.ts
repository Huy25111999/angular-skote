import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/core/models/auth.models';
import { infor } from 'src/app/model/infor';
import { UserService } from '../../service/user.service';
import { NgbActiveModal,NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
//import { ManagementComponent } from '../management.component';
import Swal from 'sweetalert2';
import { GroupRoleService } from '../../service/group-role.service';


@Component({
  selector: 'app-modal-edit',
  templateUrl: './modal-edit.component.html',
  styleUrls: ['./modal-edit.component.scss']
})
export class ModalEditComponent implements OnInit {
  @Input() dtUser: any;

  inforUser: any;
  inforRoleUser: any ; 
  message: string ; 
  err: boolean = false;

  public subscription: Subscription;
  listUsers : infor[]= [];
  appRole: FormGroup;
  idApp: number;
  idGroupRole: number;
  idUser: number ;
  selectAppId: any[] ;
  selectGroupRoleId: any [];
  isCreateByOther: any = false;
  selectStatus: any[];
  selectGender: any=[];

  constructor(   
    private fb: FormBuilder,
    private userService: UserService,
    private groupRoleService: GroupRoleService,
    public activeModal: NgbActiveModal,
    private route : Router,
    
  ) { 
    this.appRole = this.fb.group({
      userAppDto: this.fb.array([]),
    });
  }

  editForm: FormGroup = this.fb.group({
    fullName:['',[Validators.required,Validators.maxLength(100)]],
    username:['',[Validators.required,Validators.maxLength(100)]],
    password:['',[Validators.required,Validators.minLength(6)]],
    email:['',[Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    phone:['',[Validators.required, Validators.maxLength(10), Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
    address:['',[Validators.required, Validators.maxLength(100)]],
    gender:null,
    position:['',[Validators.required,Validators.maxLength(100)]],
    active: [null,Validators.required],
    userId: null,

  })

  addRoleUser(): FormGroup {
    return this.fb.group({
      userId:'',
      appId: '',
      groupRoleId:''
    });
  }

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

  ngOnInit(): void {
    this.selectStatus = [
      {id:1, name:'Kích hoạt'},
      {id:0, name:'Không kích hoạt'}
    ];
    this.selectGender = [
      {id:1, name:'Nam', active: true},
      {id:0, name:'Nữ'}
    ];
    
    this.getNameApp();

    this.userService.getID(this.dtUser.id).subscribe(data => {
      console.log(data);
      this.inforUser = data.data;
      console.log("Id edit: ",this.inforUser);
      if (this.inforUser.createdBy == "other")
      {
          this.isCreateByOther = true ; 
      }

      this.editForm.patchValue(data.data);


      this.inforRoleUser = data.data.userAppDto;
      console.log("infor RoleUser: ",this.inforRoleUser);
      this.appRole.patchValue( this.inforRoleUser);
      
      console.log("-----:", this.editForm, this.dtUser.id)
      // this.editForm.value.userAppDto.userId = this.dtUser.id;
      // console.log('appRole',this.appRole)

    }, error => {
      console.log(error);

    })

  }

//---------eventt
appGroupRole(): FormArray {
  return this.appRole.get('userAppDto') as FormArray;
}

addApp() {
  this.appGroupRole().push(this.addRoleUser());
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
  console.log(this.editForm.value.appId);
  console.log('Event',event)
  this.idApp = event.id;
  console.log('id app:',this.idApp);

  this.editForm.value.userAppDto.appId = this.idApp;

}


nodeGroupRole(event){
this.idGroupRole = event.groupRoleId;
console.log('id app:',this.idGroupRole);

this.editForm.value.userAppDto.groupRoleId = this.idGroupRole;

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


  // loadData()
  // {
  //   this.userService.getAllUsers().subscribe(data => {
  //     console.log(data);
  //     this.listUsers = data.data.content;
  //     console.log('list: ',this.listUsers);
  //   }, error => {
  //     console.log(error);
  //   })
  // }

  onSubmit() {
    this.editForm.value.gender = parseInt(this.editForm.value.gender);
    this.editForm.value.active = parseInt(this.editForm.value.active);

    this.message = '' ;
    this.err = false ;

    this.idUser = this.dtUser.id;
    console.log('data edit form 2:',this.idUser ,this.appRole ) ;
    this.editForm.value.userId = this.idUser;
    
   // this.editForm.value.userAppDto = this.appRole.value.userAppDto;
    console.log('value form:',this.editForm.value)

    this.userService.editUser(this.editForm.value).subscribe(data => {
    console.log('data edit:',data ) ;
    this.activeModal.dismiss(this.editForm.value);
    this.activeModal.close('Close click');
    this.success();
    // this.route.navigate(['/detail/{{this.dtUser.id}}']) ;
    }, error => {
      console.log(error);
      this.activeModal.close('Close click'); 
      this.error();
    })

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
}
