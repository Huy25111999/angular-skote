import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RoleService } from '../../service/role.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { ModalRoleComponent } from '../modal-role/modal-role.component';
import { ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EditRoleComponent } from '../edit-role/edit-role.component';

@Component({
  selector: 'app-management-role',
  templateUrl: './management-role.component.html',
  styleUrls: ['./management-role.component.scss']
})
export class ManagementRoleComponent implements OnInit {

  listRole: any;
  page: number = 1;
  pageSize = 10;
  count: number = 0;
  tableSize: number = 3;
  tableSizes: any = [3, 6, 9, 12];
  totalElements:number;
  selectValue: any[];

  constructor(
    private roleService: RoleService,
    private modalService : NgbModal,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.onSearch(false);
    this.selectValue = [
      {id:1, name:'Kích hoạt'},
      {id:0, name:'Không kích hoạt'}
    ];
    this.listRole =[
      {id:1, roleName:'123', role:'222',description:'Online',status: 1},
      {id:2, roleName:'666', roleCode:'895',description:'Online',status: 1},
      {id:3, roleName:'888', roleCode:'534',description:'Online',status: 1},
     ];
  }

  formData:FormGroup = this.fb.group({
    roleName: null,
    roleCode: null,
    status: null,
    description: null
  })

  
  //Search
  onSearch(flag)
  {
    console.log(this.formData.value);
    this.roleService.searchRole( {
      ...this.formData.value, page: this.page, pageSize: this.pageSize
    }).subscribe(data => {
      this.listRole = data.data.content;
      console.log('list doamin : ',data);
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

  // reset
  onReset()
  {
   // if(this.formData.valid)
      this.formData.reset();
      this.formData.value.roleCode = '';
      this.formData.value.description = '';
  }

   //Open modal
   openModalAdd(data)
  {
    const modalRef = this.modalService.open(ModalRoleComponent, { size : 'lg'})
    modalRef.componentInstance.listRole== data ;
    modalRef.result.then((data)=>{

    },(reason)=>{
      data = reason;
      this.onSearch(true) ;
    })
  }

  openModalEdit(data)
  {
    const modalRef = this.modalService.open(EditRoleComponent, { size : 'lg'})
    modalRef.componentInstance.dtRole== data ;
    modalRef.result.then((data)=>{

    },(reason)=>{
      data = reason;
      this.onSearch(true) ;
    })
  }

}
