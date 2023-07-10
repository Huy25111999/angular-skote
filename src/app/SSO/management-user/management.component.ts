import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { ModalAddComponent } from './modal-add/modal-add.component';
import { ModalEditComponent } from './modal-edit/modal-edit.component';
import { ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../service/user.service';
import { infor } from '../../model/infor';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FilterModule } from 'ng2-smart-table/lib/components/filter/filter.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { Router } from '@angular/router';
import { GroupRoleService } from '../service/group-role.service';
import * as moment from 'moment';


@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})

export class ManagementUserComponent implements OnInit
{
  POSTS: any;
  page: number = 1;
  pageSize = 10;
  count: number = 0;
  tableSize: number = 3;
  tableSizes: any = [3, 6, 9, 12];

  fullName:string = '';
  email:string = '';
  totalElements:number;

  token : any;

//--------
  listUsers : infor[]= [];
  oneUser: infor[] = [];
  searchValue : string;
  infors:infor[] ;

  public user =[];
  closeResult: string;
  searchText: any;
  viewText : string="Quản lý user";

  selectedApp: any[];
  selectGroupRoleId: any[];
  idApp: number;
  idGroupRole: number;
  selectStatus: any[];

  constructor(
    private userService: UserService,
    private groupRoleService: GroupRoleService,
    private modalService : NgbModal,
    private formBuilder: FormBuilder,
    private router:Router
    ) {
    }

  ngOnInit(): void {

    this.selectStatus = [
      {id:1, name:'Kích hoạt', active: true},
      {id:0, name:'Không kích hoạt'}
    ];
    this.onSearch(false);
   // this.getToken();
    this.getIdApp();
   // this.getGroupRole();
 
  }

  getToken(){
    this.token = localStorage.getItem('auth');
  }


  //Open modal
   openModalAdd(data)
  {
    const modalRef = this.modalService.open(ModalAddComponent, { size : 'lg'})
    modalRef.componentInstance.listUsers== data ;
    modalRef.result.then((data)=>{

    },(reason)=>{
      data = reason;
      this.onSearch(true) ;
    })
  }


  openModalEdit(data)
  {
    const modalRef = this.modalService.open(ModalEditComponent, {size : 'lg'})
    modalRef.componentInstance.dtUser = data;
    modalRef.result.then((data) => {
    }, (reason) => {
      data = reason;
      this.onSearch(true) ;
    })

  }


  public formData:FormGroup = new FormGroup({
    fullName: new FormControl(''),
    email: new FormControl(''),
    appId: new FormControl(null),
    groupRoleId: new FormControl(null),
    username: new FormControl(''),
    phone: new FormControl('',[Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    status: new FormControl(null),
    pageNumber: new FormControl(''),
    pageSize: new FormControl('')
  })

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
   
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  // Get all user
  // getListUsers()
  // {
  //   this.postService.getAllUsers().subscribe(data => {
  //     console.log(data);
  //     this.listUsers = data.data.content;
  //     console.log('list: ',this.listUsers);
  //   }, error => {
  //     console.log(error);

  //   })
  // }

// ___________Tim kiếm phân trang

/*
   searchName()
  {
    if(this.username == '')
    {
      this.getListUsers();
    }
    else
    {
      this.listUsers = this.listUsers.filter( res=>{
        return res.username.toLocaleLowerCase().match(this.username.toLocaleLowerCase());
      })
    }
  }

*/

//Pageination


  onSearch(flag)
  {
    this.formData.value.pageNumber = this.page -1 ;
    this.formData.value.pageSize = this.pageSize;
   
    this.userService.search(this.formData.value).subscribe(data => {
      this.listUsers = data.data.content;
      this.totalElements = data.data.totalElements;

    }, error => {
      //this.router.navigate(['/account/login']);
    })

  }

  convertDateTime(date)
  {
    // let now =moment(date);
    // return now.format("YYYY/MM/DD hh:mm:ss");
    let utcDate =moment.utc(date);
    let localDate = moment(utcDate).local();
    return localDate.format("YYYY/MM/DD HH:mm:ss");
  }
  

  onPageChange(event: any) {
    this.page = event;
    this.onSearch(true);
  }

  pageChangeEvent(event: any) {
    this.page = 1;
    this.pageSize = event;
    this.onSearch(true);
  }

  // ---------select 
  // get name app
  getIdApp()
  {
    this.userService.getNameApp().subscribe(data => {
      this.selectedApp = data.data;
      console.log('Infor user : ',this.selectedApp)
    }, error => {
      console.log(error);
    })
  }

  nodeApp(event){
    this.idApp = event.appId;
 }

 nodeGroupRole(event){
  this.idGroupRole = event.groupRoleId;

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
      console.log('---group role---,',this.selectGroupRoleId)
    }, error => {
      console.log(error);
    })
  }

  onReset()
  {
    this.formData.reset({
      fullName:'',
      email:'',
      username:'',
      phone:'',
    })
  }

  // getGroupRole()
  // {
  //   this.userService.getNameApp().subscribe(data => {
  //     this.selectAppId = data;
  //     console.log('Infor user : ',this.oneUser)
  //   }, error => {
  //     console.log(error);
  //   })
  // }

  // View chi tiết
  getOneUser(id)
  {
    this.userService.getID(id).subscribe(data => {
      this.oneUser = data;
    }, error => {
      console.log(error);
    })
    console.log('user: ',id);
  }

  // delete user
  delUser(id){
    this.userService.deleteUser(id).subscribe(data => {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Xóa người dùng thành công.',
        showConfirmButton: false,
        timer: 1500
      });
      this.onSearch(true);
    }, error => {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Xóa người dùng thất bại.',
        showConfirmButton: false,
        timer: 1500
      });
      console.log(error);
    })
  }

  
  deleteUser(id,nameUser){
    Swal.fire({
      title:'Xóa người dùng',
      text: `Bạn có chắc chắn muốn xóa người dùng ${nameUser} không!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Đồng ý!'

    }).then(result => {
      if (result.value) {
        this.delUser(id);

      }
    });
  }

  // Lock - unlock user
  
  getIdUser(id)
  {
    this.userService.getID(id).subscribe(data => {
      this.listUsers = data;
      console.log('list: ',this.listUsers)
    }, error => {
      console.log(error);
    })

  }

  lockUser(id)
  {
    this.userService.lockUser(id).subscribe(data => {
    //  Swal.fire('Khóa!','Bạn vừa khóa thành công.','success');
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Bạn vừa khóa thành công.',
        showConfirmButton: false,
        timer: 1500
      });
      this.onSearch(true);
    }, error => {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Khóa người dùng thất bại.',
        showConfirmButton: false,
        timer: 1500
      });
    //  Swal.fire('Khóa người dùng!', 'Khóa người dùng thất bại.','warning');
      console.log(error);
    })
  }

  unlockUser(id){
    this.userService.unlockUser(id).subscribe(data => {
    //  Swal.fire('Mở khóa!', 'Bạn vừa mở khóa thành công.','success');
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Bạn vừa mở khóa thành công.',
        showConfirmButton: false,
        timer: 1500
      });
      
      this.onSearch(true);
    }, err => {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Mở khóa người dùng thất bại.',
        showConfirmButton: false,
        timer: 1500
      });
      console.log(err);

    })
  }

  unlockOneUser(id){
    Swal.fire({
      title:'Mở khóa người dùng',
      text: 'Bạn có chắc chắn muốn mở khóa người dùng này không!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Đồng ý!'

    }).then(result => {
      if (result.value) {
        this.unlockUser(id);

      }
    });
  }

  lockOneUser(id){
    Swal.fire({
      title: 'Khóa người dùng',
      text: 'Bạn có chắc chắn muốn khóa người dùng này không!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText:  'Đồng ý',

    }).then(result => {
      if (result.value) {
        this.lockUser(id);

      }
    });
  }

}

