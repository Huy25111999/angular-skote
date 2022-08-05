import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { ModalAddComponent } from './modal-add/modal-add.component';
import { ModalEditComponent } from './modal-edit/modal-edit.component';
import { ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PostService } from '../service/post.service';
import { infor } from '../../model/infor';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FilterModule } from 'ng2-smart-table/lib/components/filter/filter.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})

export class ManagementComponent implements OnInit
{
  POSTS: any;
  page: number = 1;
  pageSize = 10;
  count: number = 0;
  tableSize: number = 3;
  tableSizes: any = [3, 6, 9, 12];
  // collectionSize = 0;
  //Search
  // username: any;
  // phone: any;
  // email: any
  username:string = '';
  phone:string = '';
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

  constructor(
    private postService: PostService,
    private modalService : NgbModal,
    private formBuilder: FormBuilder,
    private router:Router 
    ) {}

  ngOnInit(): void {
    // this.getListUsers();
    this.onSearch(false);
    this.getToken()
  }

  getToken(){
    this.token = localStorage.getItem('auth');
    console.log("token: ",this.token);
    
  }

  //Open modal
   openModalAdd(data)
  {
    const modalRef = this.modalService.open(ModalAddComponent, { size : 'lg'})
    modalRef.componentInstance.listUsers== data ;
    modalRef.result.then((data)=>{

    },(reason)=>{
      data = reason;
      this.getListUsers ;
    })
  }


  openModalEdit(data)
  {
    const modalRef = this.modalService.open(ModalEditComponent, {size : 'lg'})
    modalRef.componentInstance.dtUser = data;
    modalRef.result.then((data) => {


    }, (reason) => {
      data = reason;
      this.getListUsers()
    })

  }


  public formData:FormGroup = new FormGroup({
    username: new FormControl(''),
    phone: new FormControl(''),
    email: new FormControl('')
  })


  // Get all user
  getListUsers()
  {
    this.postService.getAllUsers().subscribe(data => {
      console.log(data);
      this.listUsers = data.data.content;
      console.log('list: ',this.listUsers);
      // this.collectionSize = this.listUsers.length ;
      // console.log('collect:',  this.collectionSize);
 

    }, error => {
      console.log(error);

    })
  }

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
    console.log(this.formData.value);
    this.postService.search( {
      ...this.formData.value, page: this.page, pageSize: this.pageSize
    }).subscribe(data => {
      this.listUsers = data.data.content;
      console.log('list user : ',this.listUsers)
      this.totalElements = data.data.totalElements;
    }, error => {

      this.router.navigate(['/account/login']);
      console.log('Lỗi 403: Bạn ko có quyền truy cập vào');
      
    })

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


  // View chi tiết
  getOneUser(id)
  {
    this.postService.getID(id).subscribe(data => {
      this.oneUser = data;
      console.log('Infor user : ',this.oneUser)
    }, error => {
      console.log(error);
    })
    console.log('user: ',id);
  }

  // Lock - unlock user
  getIdUser(id)
  {
    this.postService.getID(id).subscribe(data => {
      console.log(id);
      this.listUsers = data;
      console.log('list: ',this.listUsers)
    }, error => {
      console.log(error);
    })

  }


  lockUser(id)
  {
    this.postService.lockUser(id).subscribe(data => {
      console.log("success: lock", id);
         console.log('----------',this.listUsers);
         this.onSearch(true);
    }, error => {
      console.log(error);
    })
  }

  unlockUser(id){
    this.postService.unlockUser(id).subscribe(data => {
      console.log("success: Unclock", id);
      console.log('----------',this.listUsers);
      this.onSearch(true);
    }, err => {
      console.log(err);

    })
  }

  unlockOneUser(id){
    Swal.fire({
      title:'Mở khóa người dùng',
      text: 'Bạn có chắc chắn muốn mở khóa user này không!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Đồng ý!'
      
    }).then(result => {
      if (result.value) {
        Swal.fire('Mở khóa!', 'Bạn vừa mở khóa thành công.','success');
        this.unlockUser(id);
        
      }
    });
  }

  lockOneUser(id){
    Swal.fire({
      title: 'Khóa người dùng',
      text: 'Bạn có chắc chắn muốn khóa user này không!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText:  'Đồng ý',
      
    }).then(result => {
      if (result.value) {
        Swal.fire('Khóa!','Bạn vừa khóa thành công.','success');
        this.lockUser(id);
       
      }
    });
  }

}

