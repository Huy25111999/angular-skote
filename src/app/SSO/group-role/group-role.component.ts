import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GroupRoleService } from '../service/group-role.service';
import { AddGroupRoleComponent } from './add-group-role/add-group-role.component';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';

@Component({
  selector: 'app-group-role',
  templateUrl: './group-role.component.html',
  styleUrls: ['./group-role.component.scss']
})
export class GroupRoleComponent implements OnInit {

  listGroupRole: any;
  page: number = 1;
  pageSize = 10;
  count: number = 0;
  tableSize: number = 3;
  tableSizes: any = [3, 6, 9, 12];
  totalElements:number;
  selectStatus: any[];

  constructor(
    private groupRoleService: GroupRoleService,
    private modalService : NgbModal,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.onSearch(false);
    this.selectStatus = [
      {id:1, name:'Kích hoạt'},
      {id:0, name:'Không kích hoạt'}
    ];

    this.listGroupRole =[
      {id:1, groupName:'123',description:'Online',status: 1},
      {id:2, groupName:'666',description:'Online',status: 1},
      {id:3, groupName:'888',description:'Online',status: 1},
     ];
  }

  formData:FormGroup = this.fb.group({
    groupName: null,
    groupStatus: null
  })

  
  //Search
  onSearch(flag)
  {
    console.log(this.formData.value);
    this.groupRoleService.searchGroupRole( {
      ...this.formData.value, page: this.page, pageSize: this.pageSize
    }).subscribe(data => {
      this.listGroupRole = data.data.content;
      console.log('group role : ',data);
      this.totalElements = data.data.totalElements;
    }, error => {
      console.log(error);    
       //   Swal.fire('Tìm kiếm!', 'Tìm kiếm thông tin thất bại.','error');

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

  onReset()
  {
   // if(this.formData.valid)
      this.formData.reset();
      this.formData.value.roleCode = '';
      this.formData.value.description = '';
  }
  
   //Open modal
   openAddGroupRole(data)
  {
    const modalRef = this.modalService.open(AddGroupRoleComponent, { size : 'lg'})
    modalRef.componentInstance.listGroupRole== data ;
    modalRef.result.then((data)=>{

    },(reason)=>{
      data = reason;
      this.onSearch(true) ;
    })
  }

}
