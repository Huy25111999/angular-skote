import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
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
import { PaginationComponent } from '../pagination/pagination.component';

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
  username: any;
  phone: any;
  email: any
  searchName= '';
  searchPhone= '';
  searchEmail= ''
  pageNum=1;



//--------
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
    // this.getListUsers(); 
    this.onSearch();
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

  searchPhone()
  {
    if(this.phone == '')
    {
      this.getListUsers();
    }
    else
    {
      this.listUsers = this.listUsers.filter( res=>{
        return res.phone.toLocaleLowerCase().match(this.phone.toLocaleLowerCase());
      })
    }
  }  

  searchEmail()
  {
    if(this.email == '')
    {
      this.getListUsers();
    }
    else
    {
      this.listUsers = this.listUsers.filter( res=>{
        return res.email.toLocaleLowerCase().match(this.email.toLocaleLowerCase());
      })
    }
  }    


//Pageination
/*
onSearch(isActionPage: boolean) {
  let dto;
  if (!isActionPage) {
    this.sortList = {
     
    }
    this.sortPriorityList = [];
    this.page = 1;
    this.pageSize = 10;
    dto = this.mapSearchDto(this.formGroup.value);
    this.historySearch = dto;
    this.setOfCheckedId.clear();
    this.setOfCheckedRecord.clear();
  } else {
    dto = this.historySearch;
  }
  DataUtilsService.removeEmptyPros(dto);
  this.loading = true;
  this.records = [];
  this.collectionSize = 0;
  const sortArr = this.getSortArr();

  this.postService.search(dto, this.page - 1, this.pageSize, sortArr).subscribe(res => {
    this.loading = false;
    if (res && res.content) {
      this.records = res.content;
      this.records.forEach(e => {
        e.id = e.documentId;
        e.docLable = getDocsLabel(e.documentType);
        e.statusLable = getStatusLabel(e.status);
        e.isOverDealine = e.deadline && moment().isAfter(moment(e.deadline), 'days');
        // e.isOverDealine = true
      });

      this.refreshCheckedStatus();
    }
    this.collectionSize = res.totalElements
  },() => {
    this.loading = false;
  })
}
*/
  
  onSearch()
  {
    this.postService.search( this.searchName, this.searchPhone, this.searchEmail, this.pageNum).subscribe(data => {
      this.listUsers = data.data.content;
      console.log('list user : ',this.listUsers)
    }, error => {
      console.log(error);
    })
    
  }

  //Pagination

  onPageChange(event: any) {
    this.page = event;
    // this.onSearch(true);
  }

  pageChangeEvent(event: any) {
    this.page = 1;
    this.pageSize = event;
    // this.onSearch(true);
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

