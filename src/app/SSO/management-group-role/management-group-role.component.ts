import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoleService } from '../service/role.service';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { GroupRoleService } from '../service/group-role.service';
import { ModalRoleComponent } from '../role/modal-role/modal-role.component';
import { EditRoleComponent } from '../role/edit-role/edit-role.component';
import { AddGroupRoleComponent } from '../group-role/add-group-role/add-group-role.component';
import { domain } from 'src/app/model/domain';
import { UserService } from '../service/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EditGroupRoleComponent } from '../group-role/edit-group-role/edit-group-role.component';
import { role } from 'src/app/model/role';
import Swal from 'sweetalert2';
import { app } from 'src/app/model/app';
import { AddDomainComponent } from '../managementDomain/add-domain/add-domain.component';
import { EditDomainComponent } from '../managementDomain/edit-domain/edit-domain.component';
import { ConnectUserRoleComponent } from '../connect-user-role/connect-user-role.component';

@Component({
  selector: 'app-management-group-role',
  templateUrl: './management-group-role.component.html',
  styleUrls: ['./management-group-role.component.scss']
})
export class ManagementGroupRoleComponent implements OnInit {
  page: number = 0;
  pageSize = 5;
  count: number = 0;
  tableSize: number = 3;
  tableSizes: any = [3, 6, 9, 12];
  totalElements:number;
  listRole: any = [];
  listGroupRole: any= [];
  listDomain :any= [];
  totalSize:number;
  idApp: number ; 

 // listApp: app[] = [];
  isRoll:any= true;
  isGroupRoll:any= true;
  listApp : app[]= [];
  constructor(
    private modalService : NgbModal,
    private roleService: RoleService,
    private userService: UserService,
    private groupRoleService: GroupRoleService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
   // this.onSearchRole(false);
    //this.onSearchGroupRole(false);
     this.searchApp(false);
  }

  formData:FormGroup = this.fb.group({
    app: '',
    pageNumber: this.page ,
    pageSize: this.pageSize
  })

  //--------- App
  searchApp(flag)
  {
    // const body = {app: " ", pageNumber: this.page, pageSize: this.pageSize}

    this.formData.value.pageNumber = this.page;
    this.formData.value.pageSize = this.pageSize;
    console.log(this.formData.value);
    this.groupRoleService.getAllApp( this.formData.value).subscribe(data => {
      console.log('app',data);
      this.listDomain = data.data.content;
      this.totalSize = data.data.totalElements;
      console.log('_________', this.totalSize)
    }, error => {
      console.log(error);
    })
  }

  onPageChangeApp(event: any) {
    this.page = event - 1;
    this.searchApp(true);
  }

  pageChangeEventApp(event: any) {
    this.page = 1;
    this.pageSize = event;
   this.searchApp(true);
  }


  // create- edit app
  openAddApp(data)
  {
    const modalRef = this.modalService.open(AddDomainComponent, { size : 'lg'})
    modalRef.componentInstance.dtApp = data ;
    modalRef.result.then((data)=>{

    },(reason)=>{
      data = reason;
      this.listApp ;
    })
  }

  openEditApp(data)
  {
    const modalRef = this.modalService.open(EditDomainComponent,{ size : 'lg'})
    modalRef.componentInstance.dtDomain = data;
    modalRef.result.then( data=>{

    },reason =>{
      data = reason;
      this.listDomain;
      
    })
  }

  // delete app
  delete(id){
    this.groupRoleService.deleteApp(id).subscribe(data => {
      console.log('app',data);
      this.searchApp(true);
    }, error => {
      console.log(error);
    })
  }

  deleteApp(id,nameApp){
    Swal.fire({
      title:'Xóa app',
      text: `Bạn có chắc chắn muốn xóa app ${nameApp} này không!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Đồng ý!'

    }).then(result => {
      if (result.value) {
        Swal.fire('Xóa app!', 'Xóa app thành công.','success');
        this.delete(id);

      }
    });
  }

  // view App
  view(id){
    this.groupRoleService.getIdApp(id).subscribe(data => {
      this.idApp = data.data.id ;
      console.log('Id app', this.idApp)
     // this.getListGroupRole(id);
    }, error => {
      console.log(error);
    })
  }
  /*
  onSearchRole(flag)
  {
    console.log();
    this.roleService.searchRole( {
       page: this.page, pageSize: this.pageSize
    }).subscribe(data => {
      this.listRole = data.data.content;
      console.log('list doamin : ',data);
      this.totalElements = data.data.totalElements;
    }, error => {
      console.log(error);
    })

  }
  onPageChange(event: any) {
    this.page = event;
    this.onSearchRole(true);
  }

  pageChangeEvent(event: any) {
    this.page = 1;
    this.pageSize = event;
    this.onSearchRole(true);
  }
*/

// ----------role
  showListRole(){
    if(this.isRoll){
      this.isRoll = false
    }
    else{
      this.isRoll = true
    }
  }

 // creat role
  createRole()
  {
    const tbody = this.listRole;
    console.log('tbody', tbody);
    this.roleService.addRole(tbody).subscribe(data => {
      console.log(data);
   }, error => {
      return  error;
   })
  }

  openAddRole()
  {
    const modalRef = this.modalService.open(ModalRoleComponent, { size : 'lg'})
    modalRef.componentInstance.dtIdRole= this.idApp ;
    modalRef.result.then((reason)=>{
    console.log('role:',reason)
    this.listRole.push(reason);
    })
  }

// edit role
  editRole()
  {
    const tbody = this.listRole;
    console.log('tbody', tbody);
      this.roleService.editRole(tbody).subscribe(data => {
      console.log ("submit:",tbody);
      this.success();
    }, error => {
      console.log(error);
      this.error;
      return ;
    })
  }

  openEditRole(data)
  {
    console.log(  'role', data);
    const modalRef = this.modalService.open(EditRoleComponent, { size : 'lg'})
    modalRef.componentInstance.dtRole= data ;
    modalRef.result.then((data)=>{
    },(reason)=>{
      // data = reason;
       console.log('edit-role',reason);
       console.log('edit-role',data);
       this.listRole.splice(data,reason);

    })
  }

  //----------group role-----------

  showListGroupRole(){
    if(this.isGroupRoll){
      this.isGroupRoll = false
    }
    else{
      this.isGroupRoll = true
    }
  }

  // getListGroupRole(id)
  // {
  //   this.groupRoleService.getAllGroupRole(id).subscribe(data => {
  //     this.listGroupRole = data.data;
  //     console.log('all group role:', this.listGroupRole)
  //   }, error => {
  //     console.log(error);
  //   })
  // }

  createGroupRole()
  {
    console.log('creater group role:',this.listGroupRole);
      this.groupRoleService.addGroupRole(this.listGroupRole).subscribe(data => {
        console.log(data);
      }, error => {
        console.log(error)
        return  error;
      })
  }

  editGroupRole()
  {
    const tbody = this.listGroupRole;
    console.log('tbody', tbody);
    const id =1;
      this.groupRoleService.editGroupRole(id,tbody).subscribe(data => {
      console.log ("submit:",tbody);
      this.success();
    }, error => {
      console.log(error);
      this.error;
      return ;
    })
  }



  // openEdiByRole(data)
  // {
  //   console.log(  'role', data);
  //   const modalRef = this.modalService.open(EditByRoleComponent, { size : 'lg'})
  //   modalRef.componentInstance.dtEditRole= data ;
  //   modalRef.result.then(data=>{

  //   },reason =>{
  //     data = reason;
  //     this.listRole;

  //   })
  // }


  openAddGroupRole()
  {
    const modalRef = this.modalService.open(AddGroupRoleComponent, { size : 'lg'})
    modalRef.componentInstance.dtIdGroupRole= this.idApp ;
    modalRef.result.then((reason)=>{
      this.listGroupRole.push(reason);
      console.log('group role:',this.listGroupRole);
    })
  }

  openEditGroupRole(data)
  {
    const modalRef = this.modalService.open(EditGroupRoleComponent, { size : 'lg'})
    modalRef.componentInstance.dtGroupRole = data ;
    console.log ( this.listGroupRole);
    modalRef.result.then((reason)=>{
      this.listGroupRole.splice(this.listGroupRole,1,reason);
      console.log('group role:',this.listGroupRole);
    })
  }

  // connect user-role
  connectRoleUser(id)
  {
    const modalRef = this.modalService.open(ConnectUserRoleComponent, { size : 'lg'})
    modalRef.componentInstance.dtIdUserRole= this.idApp ;
    modalRef.componentInstance.dtIdGroupRole= id ;
    modalRef.result.then((reason)=>{
      console.log('user role:',reason);
    })
  }




  // Notification
  success() {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Sửa quyền thành công',
      showConfirmButton: false,
      timer: 1500
    });
  }

  error() {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'Sửa quyền thất bại',
      showConfirmButton: false,
      timer: 1500
    });
  }

}


