import { Component, Input, OnInit } from '@angular/core';
import { ModalAddComponent } from '../modal-add/modal-add.component';
import { ModalEditComponent } from '../modal-edit/modal-edit.component';
import { ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PostService } from '../service/post.service';
import { infor } from '../../model/infor';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FilterModule } from 'ng2-smart-table/lib/components/filter/filter.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})

export class ManagementComponent implements OnInit
{
  POSTS: any;

  page: number = 1;
  count: number = 0;
  tableSize: number = 3;
  tableSizes: any = [3, 6, 9, 12];


  listUsers : infor[]= [];
  oneUser: infor[] = [];
  searchValue : string;
  infors:infor[] ;

  public user =[];
  closeResult: string;
  searchText: any;
    
  constructor(
    private postService: PostService,
    private modalService : NgbModal,
    private formBuilder: FormBuilder
    ) {}

  ngOnInit(): void {
    this.getListUsers(); 
  }

  fetchPosts(): void {
    this.postService.getAllUsers().subscribe(
      (response) => {
        this.listUsers = response.data.content;
        console.log("view api",this.listUsers);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.fetchPosts();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.fetchPosts();
  }


  //Get all user
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

  getListUsers()
  {
    this.postService.getAllUsers().subscribe(data => {
      console.log(data);
      this.listUsers = data.data.content;
      console.log('list: ',this.listUsers);
      
    }, error => {
      console.log(error);
      
    })
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

  //Lock user
  getIdUser(id)
  {
    this.postService.getID(id).subscribe(data => {
      console.log(id);
      this.listUsers = data;
      console.log('list: ',this.listUsers)
    }, error => {
      console.log(error);
    })
    console.log('user: ',id);
    console.log('----------',this.listUsers);
    
  }


  lockUser(id)
  {
    this.postService.lockUser(id).subscribe(data => {
      console.log("success: lock", id);
         console.log('----------',this.listUsers);
    }, error => {
      console.log(error);
    })
  }

  unlockUser(id){
    this.postService.unlockUser(id).subscribe(data => {
      console.log("success: Unclock", id);
      console.log('----------',this.listUsers);
    }, err => {
      console.log(err);
      
    })
  }


  unlockOneUser(id) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger ms-2'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Mở khóa người dùng',
        text: 'Bạn có chắc chắn muốn mở khóa user này không!',
        icon: 'warning',
        confirmButtonText: 'Yes, unlock it!',
        cancelButtonText: 'No, cancel!',
        showCancelButton: true
      })
      .then(result => {
        if (result.value) {
          swalWithBootstrapButtons.fire(
            'Mở khóa!',
            'Bạn vừa mở khóa thành công.',
            'success'
          );
          
          this.unlockUser(id);

        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Mở khóa thất bại:)',
            'error'
          );
        }
      });
  }


  lockOneUser(id) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger ms-2'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Khóa người dùng',
        text: 'Bạn có chắc chắn muốn khóa user này không!',
        icon: 'warning',
        confirmButtonText: 'Yes, lock it!',
        cancelButtonText: 'No, cancel!',
        showCancelButton: true
      })
      .then(result => {
        if (result.value) {
          swalWithBootstrapButtons.fire(
            'Khóa!',
            'Bạn vừa khóa thành công.',
            'success'
          );
          this.lockUser(id);

        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Khóa người dùng thất bại :)',
            'error'
          );
        }
      });
  }

}

