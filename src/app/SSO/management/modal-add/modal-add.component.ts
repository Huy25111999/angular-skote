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

  selectApp: any[] ;
  selectGroupRole: any[];
  // public formData:FormGroup = new FormGroup({
  //   username: new FormControl(''),
  //   password: new FormControl(''),
  //   email: new FormControl(''),
  //   phone: new FormControl(''),
  //   address: new FormControl(''),
  //   gender: new FormControl(''),
  //   position: new FormControl('')

  // })
  name = '';
  constructor( 
    private fb: FormBuilder,
    private userService: UserService,
    private groupRoleService: GroupRoleService,
    private modalService : NgbModal,
    public activeModal: NgbActiveModal,
    private route:Router
    ) {
      this.appRole = this.fb.group({
        roleUser: this.fb.array([]),
      });
    }

    
  ngOnInit(): void {
    this.formData = this.fb.group({
      // username:['',[Validators.required,this.forbiddenUsername(['admin', 'manager'])]],
      username:['',[Validators.required,Validators.maxLength(100)]],
      password:['',[Validators.required,Validators.minLength(6)]],
      email:['',[Validators.required, Validators.email]],
      status:['',[Validators.required]],
      role:['',[Validators.required, Validators.maxLength(10)]]
    })

    this.searchApp();

    this.getNameApp();

  }
  get f(){
    return this.formData.controls;
  }

  getNameApp()
  {
    this.userService.getNameApp().subscribe(data => {
    this.selectApp = data;
    console.log ('select app:',this.selectApp)
    }, error => {
      console.log(error);
    })
  }

  getGroupRole(id)
  {
    this.groupRoleService.getAllGroupRole(id).subscribe(data => {
      this.selectGroupRole = data;
    }, error => {
      console.log(error);
    })
  }


  //------------
  appGroupRole(): FormArray {
    return this.appRole.get('roleUser') as FormArray;
  }
  addPhone(): FormGroup {
    return this.fb.group({
      app: '',
      groupRole:''
    });
  }

  addApp() {
    this.appGroupRole().push(this.addPhone());
  }
  deleteApp(i: number) {
    this.appGroupRole().removeAt(i);
  }


  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
   
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  
  searchApp()
  {
    console.log(this.formData.value);
    this.groupRoleService.getAllApp( this.formData.value).subscribe(data => {
      console.log('app',data);
    }, error => {
      console.log(error);
    })
  }
  
  onSubmit()
  {
     this.message = '' ;
     this.err = false ; 
     this.formData.value.gender = parseInt(this.formData.value.gender)
     this.userService.addUser(this.formData.value).subscribe(data => {
      console.log(this.listUsers);
      console.log ("submit:", this.formData.value);
      this.activeModal.dismiss(this.formData.value);
      this.activeModal.close('Close click');  
      this.success();
      this.route.navigate(['/management'])  
      
    }, error => {
      this.err = true ; 
      this.message = error ; 
      console.log(this.message);
      return ;
      // this.activeModal.close('Close click');  
      //this.error();
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
