import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '../../service/role.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { ModalRoleComponent } from '../modal-role/modal-role.component';
import { ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EditRoleComponent } from '../edit-role/edit-role.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-management-role',
  templateUrl: './management-role.component.html',
  styleUrls: ['./management-role.component.scss']
})
export class ManagementRoleComponent implements OnInit {

  id: any ; 
  index: number= 0;
  page: number = 1;
  pageSize = 10;
  count: number = 0;
  tableSize: number = 3;
  tableSizes: any = [3, 6, 9, 12];
  totalElements:number;
  selectValue: any[];
  selectStatus: any[];
  selectParamId: any[];

  listRole: any = [];
  idApp: number ;

  constructor(
    private roleService: RoleService,
    private modalService : NgbModal,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router:Router,
  ) { 
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    //this.onSearch(false);
    this.selectStatus = [
      {id:1, name:'Kích hoạt', active: true},
      {id:0, name:'Không kích hoạt'}
    ];

    this.getParamRole();
  }

  formData:FormGroup = this.fb.group({
    roleId:'',
    appId:'',
    role:['',[Validators.required]],
    roleCode:['',[Validators.required]],
    status:['',[Validators.required]],
    description:[''],
    systemParamId: ['']
  })

  get f(){
    return this.formData.controls;
  }

  //Search
  // onSearch(flag)
  // {
  //   console.log(this.formData.value);
  //   this.roleService.searchRole( {
  //     ...this.formData.value, page: this.page, pageSize: this.pageSize
  //   }).subscribe(data => {
  //     this.listRole = data.data.content;
  //     console.log('list doamin : ',data);
  //     this.totalElements = data.data.totalElements;
  //   }, error => {
  //     console.log(error);    

  //   })

  // }

  // onPageChange(event: any) {
  //   this.page = event;
  //   this.onSearch(true);
  // }

  // pageChangeEvent(event: any) {
  //   this.page = 1;
  //   this.pageSize = event;
  //   this.onSearch(true);
  // }

  // reset
  onReset()
  {
      this.formData.reset();
      this.formData.value.roleCode = '';
      this.formData.value.description = '';
  }

  onSubmit()
  {
    this.formData.value.appId = this.id;
      this.listRole.push(this.formData.value);
  }

  onCreatRole()
  {
    const tbody = this.listRole;
    this.roleService.editRole(tbody).subscribe(data => {
      console.log('list role', this.listRole);
      console.log('data', data.data);
      this.success();
      this.router.navigate(['/group-role/'+this.id]);

  }, error => {
     return  error;
  })
  }

  openEditRole(index)
  {
    this.formData.patchValue(this.listRole[index]);
    console.log(index);
    console.log('data', this.listRole[index]);
  }
  
  getParamRole()
  { 
    this.roleService.getAllParamID().subscribe(data => {
      console.log ("submit:", data);
      this.selectParamId = data.data;  
    }, error => {
        console.log(error);
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

   //Open modal
  //  openModalAdd(data)
  // {
  //   const modalRef = this.modalService.open(ModalRoleComponent, { size : 'lg'})
  //   modalRef.componentInstance.listRole== data ;
  //   modalRef.result.then((data)=>{

  //   },(reason)=>{
  //     data = reason;
  //     this.onSearch(true) ;
  //   })
  // }

  // openModalEdit(data)
  // {
  //   const modalRef = this.modalService.open(EditRoleComponent, { size : 'lg'})
  //   modalRef.componentInstance.dtRole== data ;
  //   modalRef.result.then((data)=>{

  //   },(reason)=>{
  //     data = reason;
  //     this.onSearch(true) ;
  //   })
  // }

}
