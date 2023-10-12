import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { domain } from 'src/app/model/domain';
import Swal from 'sweetalert2';
import { ConnectUserRoleComponent } from '../../connect-user-role/connect-user-role.component';
import { AddGroupRoleComponent } from '../../group-role/add-group-role/add-group-role.component';
import { EditRoleComponent } from '../../role/edit-role/edit-role.component';
import { ModalRoleComponent } from '../../role/modal-role/modal-role.component';
import { GroupRoleService } from '../../service/group-role.service';
import { RoleService } from '../../service/role.service';
import { UserService } from '../../service/user.service';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { EditGroupRoleComponent } from '../../group-role/edit-group-role/edit-group-role.component';

@Component({
  selector: 'app-creat-app',
  templateUrl: './creat-app.component.html',
  styleUrls: ['./creat-app.component.scss',]
})
export class CreatAppComponent implements OnInit {

 
  listRole: any = [];
  page: number = 1;
  pageSize = 10;
  count: number = 0;
  tableSize: number = 3;
  tableSizes: any = [3, 6, 9, 12];
  totalElements:number;
  selectValue: any[];
  oneApp : domain[]= [];

  // role
  isRoll:any= true;
  isGroupRoll:any= true;
  isDisabled: any = false;
  isDisabledRole:any = false;
  selectStatus: any[];
  selectParamId: any[];
  currentIndex = null;
  message: string;

  // Group role
  items:any = [] ;
  config = TreeviewConfig.create({
    hasFilter: true,
    hasCollapseExpand: true
  });
  dataSource: any= [];
  groupRoleId:any=[];
  currentIndexGroupRole = null;
  messageError: string;
  
  listRoleUpdate = [];
  listGroupRole: any = [];
  listGroupRoleUpdate = [];
  idApp: number ; 
  defaultValue;
  
  constructor(
    private roleService: RoleService,
    private groupRoleService: GroupRoleService,
    private userService: UserService,
    private modalService : NgbModal,
    private router:Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    this.selectStatus = [
      {id:1, name:'Kích hoạt', active: true},
      {id:0, name:'Không kích hoạt'}
    ];
    this.defaultValue = 1

    //this.getParamRole();

  }

  formData:FormGroup = this.fb.group({
    appName:['',[Validators.required]],
    appCode:['',[Validators.required]],
    privateKey:['',[Validators.required]],
    status:[null,Validators.required],
    description:['',[Validators.required]],
    hook: ['',[Validators.required]],
    id:['']
  })

  get f(){
    return this.formData.controls;
  }

  activeTab:string = 'App';
  onTabClick(tab){
    this.activeTab = tab;
  }

  isChecked()
  {
    this.isDisabled = true;

    // Swal.fire({
    //   title:'Xóa role',
    //   text: `Bạn phải tạo mới app trước khi tạo mới quyền!`,
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#34c38f',
    //   cancelButtonColor: '#f46a6a',
    //   confirmButtonText: 'Đồng ý!'

    // }).then(result => {
    //   if (result.value) {
    //     this.activeTab == 'App'
    //   }
    // });
  }

  // reset
  onReset()
  {
       this.formData.reset({
        appName: '',
        appCode:'',
        privateKey:'',
        status:'',
        description:'',
        hook:''
       });

  }
  
  onSubmit()
  {
    this.count  += 1;
    if (this.count == 1){
      this.creatApp();
    }
    else{
        this.editApp();
    }
  
  }

  creatApp()
  {
      this.userService.addDomain(this.formData.value).subscribe(data => {
      console.log('data app', data);
      this.idApp =  data.data.appId ; 
      console.log ("form app:", this.formData.value);
      console.log('id app', this.idApp);
      this.success();
      this.isDisabled = true;
   //   this.router.navigate(['/role/'+this.idApp]);     
    }, error => {
       console.log(error) ;  
       this.isDisabled = false; 
    })
  }

  editApp()
  {
    this.formData.value.status = parseInt(this.formData.value.status);
    this.formData.value.id = this.idApp;
    this.userService.editApp(this.formData.value).subscribe(data => {
    this.editSuccess();  
    this.router.navigate(['/role']);
    }, error => {
      console.log(error);
      this.error();
    })
  }

 // ------- role

//  getParamRole()
//  { 
//    this.roleService.getAllParamID().subscribe(data => {
//      console.log ("submit:", data);
//      this.selectParamId = data.data;  
//    }, error => {
//        console.log(error);
//      return ;
//    })
//  }

 
  formRole:FormGroup = this.fb.group({
    appId:'',
    role:['',[Validators.required]],
    roleCode:['',[Validators.required]],
    status:[null,Validators.required],
    description:[''],
    systemParamId: [null]
  })

  get fRole(){
    return this.formRole.controls;
  }
  
  // submitRole()
  // {
  //   console.log('formRole',this.formRole.value);

  //   if(this.currentIndex == null)
  //   {
  //     const role = this.listRole.find((e) => e.role === this.formRole.value.role);
  //     if (role){
  //       console.log('Tên role đã tồn tại');
  //       this.message = 'Tên role đã tồn tại, vui lòng nhập lại tên!';
  //       return ;
  //     }
   
  //     const code = this.listRole.find((e) => e.roleCode === this.formRole.value.roleCode);
  //     if (code){
  //       console.log('Mã quyền đã tồn tại');
  //       this.message = 'Mã quyền đã tồn tại, vui lòng nhập lại tên!';
  //       return ;
  //     }
  //     this.formRole.value.appId = this.idApp;
  //     this.listRole.push(this.formRole.value);
  //     console.log('formRole',this.formRole.value);
  //     this.resetRole();
  //   }else{
  //     this.formRole.value.appId = this.idApp;
  //     console.log('formRole',this.formRole.value);
  //     this.listRole.splice(this.currentIndex, 1, this.formRole.value);;
  //     this.resetRole();
  //   }
  // }


 saveRole()
 {
   const tbody = this.listRole;
   this.roleService.editRole(tbody).subscribe(data => {
      console.log('list role', this.listRole, data);
      this.listRole;
      this.saveSuccess();
      // this.listRoleUpdate = data.data;
      // console.log('array-listrole-update:', this.listRoleUpdate);
      this.success();
      this.isDisabledRole = true;

  }, error => {
     return  error;
  })
 }

 resetRole()
 {
   this.currentIndex = null;
   this.formRole.reset({
     appId:'',
     role:'',
     roleCode:'',
     status:'',
     description:'',
     systemParamId:''
   })
 }

 
 openAddRole()
 {
   const modalRef = this.modalService.open(ModalRoleComponent, { size : 'lg'})
   modalRef.componentInstance.dtIdRole= this.idApp ;
   modalRef.result.then((reason)=>{
   if(reason == "Close click")
      return
   else
   {
      const role = this.listRole.find((e) => e.role === reason.role);
      if (role){
        console.log('Tên role đã tồn tại');
        this.message = 'Tên role đã tồn tại, vui lòng nhập lại tên!';
        return ;
      }

      const code = this.listRole.find((e) => e.roleCode === reason.roleCode);
      if (code){
        console.log('Mã quyền đã tồn tại');
        this.message = 'Mã quyền đã tồn tại, vui lòng nhập lại tên!';
        return ;
      }
      this.message = "";
      this.listRole.push(reason);
      console.log('list role',this.listRole);
   }
   

   })
 }


 openEditRole(data)
  {
    console.log(  'role', data);
    const modalRef = this.modalService.open(EditRoleComponent, { size : 'lg'})
    modalRef.componentInstance.dtRole= this.listRole[data] ;
      modalRef.result.then((reason)=>{
      if(reason == "Close click")
        return
      else
      {
        console.log('data', reason);
        this.listRole.splice(data,1,reason);
        console.log('list role--', this.listRole);
      }
    })
    // this.currentIndex != null;
    // this.currentIndex = index;
    // this.formRole.patchValue(this.listRole[index]);
    // console.log(index);
    // console.log('data', this.listRole[index]);
  }

  deleteRole(i){
    this.listRole.splice(i,1);
  }

  
  delRole(id,nameApp){
    Swal.fire({
      title:'Xóa quyền',
      text: `Bạn có chắc chắn muốn xóa quyền ${nameApp} này không!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Đồng ý!'

    }).then(result => {
      if (result.value) {
 
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Xóa quyền thành công.',
          showConfirmButton: false,
          timer: 1500
        });
        this.deleteRole(id);

      }
    });
  }

  showListRole(){
    if(this.isRoll){
      this.isRoll = false
    }
    else{
      this.isRoll = true
    }
  }


  //----------group role-----------

  // getTree()
  // {
  //   this.getTreeRole(this.idApp);
  // }
  
  showListGroupRole(){
    if(this.isGroupRoll){
      this.isGroupRoll = false
    }
    else{
      this.isGroupRoll = true
    }
  }

  // getTreeRole(id)
  // {
  //   this.groupRoleService.getAllRole(id).subscribe(data => {
  //     this.listRole= data.data;
  //   //  this.listRole= data.data.map(e => e.systemParam)
  //     console.log("Domains",this.listRole);

  //   this.dataSource = this.listRole.map(e => {
  //     e.text = e.systemParam;
  //      e.value = e.systemParamId;
  //     e.children = e.roleRes ?  e.roleRes.map(k => {
  //       return {
  //         text: k.role,
  //         value: k.roleId
  //       }
  //     }) : null;  
  //       return {
  //                text:e.text,
  //                value: e.value,
  //                children:e.children               
  //               }
  //   }) ; 
  //   console.log('---',this.dataSource);
 
  //   this.items = this.getItems(this.dataSource);
  //   }, error => {
  //     console.log(error);
      
  //   })

     
  // }

  // getItems(parentChildObj) {
  //   let itemsArray = [];
  //   parentChildObj.forEach(set => {
  //     itemsArray.push(new TreeviewItem(set))
  //   });
  //   return itemsArray;
  // }

  // onFilterChange(value: string): void {
  //   console.log('filter:', value);
  // }

  // onSelectedChange(value: string): void {
  //   this.groupRoleId = value;
  //   console.log ('inđẽ tree',  this.groupRoleId ); 
  // }
  
  // submitGroupRole()
  // {

  //   console.log('formRole',this.formGroupRole.value);

  //   if(this.currentIndexGroupRole == null)
  //   {
  //     const role = this.listGroupRole.find((e) => e.groupRole === this.formGroupRole.value.groupRole);
  //     if (role){
  //       console.log('Tên nhóm quyền đã tồn tại');
  //       this.messageError = 'Tên nhóm quyền đã tồn tại, vui lòng nhập lại tên!';
  //       return ;
  //     }
  
  //     this.formGroupRole.value.appId = this.idApp ; 
  //     this.formGroupRole.value.roleId = this.groupRoleId;
  //     console.log('Group role',this.groupRoleId);
  //     this.listGroupRole.push(this.formGroupRole.value);
  //     this. resetGroupRole();
      
  //   }else{
  //     this.formGroupRole.value.appId = this.idApp;
  //     this.listGroupRole.splice(this.currentIndexGroupRole, 1, this.formGroupRole.value);
  //     console.log('data',this.formGroupRole.value);
  //     this. resetGroupRole();
  //   }

  // }
  
  resetGroupRole()
  {
    this.currentIndexGroupRole = null;
    this.formGroupRole.reset({
      appId: '' ,
      groupRole:'',
      status:'',
      description:'',
      groupRoleId:'',
      roleId:''
    })
  }

  openAddGroupRole()
  {
    const modalRef = this.modalService.open(AddGroupRoleComponent, { size : 'lg'})
    modalRef.componentInstance.dtIdApp= this.idApp ;
    modalRef.result.then((reason)=>{
    if(reason == "Close click")
      return
    else{
      const role = this.listGroupRole.find((e) => e.groupRole === reason.groupRole);
      if (role){
        console.log('Tên nhóm quyền đã tồn tại');
        this.messageError = 'Tên nhóm quyền đã tồn tại, vui lòng nhập lại tên!';
        return ;
      }
      const roleCode = this.listGroupRole.find((e) => e.groupRoleCode === reason.groupRoleCode);
      if (roleCode){
        console.log('Mã nhóm quyền đã tồn tại');
        this.messageError = 'Mã nhóm quyền đã tồn tại, vui lòng nhập lại mã!';
        return ;
      }
      this.message = "";
      this.listGroupRole.push(reason);
    }
     
    })
  }

  openEditGroupRole(data)
  {
    console.log(  'role', data);
    const modalRef = this.modalService.open(EditGroupRoleComponent, { size : 'lg'})
    modalRef.componentInstance.dtGroupRole= this.listGroupRole[data] ;
    modalRef.componentInstance.dtIdApp= this.idApp ;
    modalRef.result.then((reason)=>{
    if(reason == "Close click")
      return
    else
    { 
      this.message = "";
      console.log('data', reason);
      this.listGroupRole.splice(data,1,reason);
      console.log('list role--', this.listRole);
    }
    })    
    // this.currentIndexGroupRole != null;
    // this.currentIndexGroupRole = index;
    // this.formGroupRole.patchValue(this.listGroupRole[index]);
  }

  formGroupRole:FormGroup = this.fb.group({
    appId: '' ,
    groupRole:['',[Validators.required]],
    status:[null,Validators.required],
    description:[''],
    groupRoleId:[''],
    roleId:['']
  })

  get fGroup(){
    return this.formGroupRole.controls;
  }

  
  createGroupRole()
  {
      this.groupRoleService.editGroupRole(this.idApp,this.listGroupRole).subscribe(data => {
        console.log('create group role',data);
        // this.listGroupRole.splice( this.listGroupRole);
        // console.log('array :',this.listGroupRole);

        // this.listGroupRoleUpdate = data.data;
        // console.log('array-listrole-update:', this.listGroupRoleUpdate);
        
        // this.listGroupRoleUpdate.forEach(element => {
        //     this.listGroupRole.push(element);
        // });
        this.success();

      }, error => {
        console.log(error)
        return  error;
      })
  }

  deleteGroupRole(i){
    this.listGroupRole.splice(i,1);
  }

  
  delGroupRole(id,nameApp){
    Swal.fire({
      title:'Xóa nhóm quyền',
      text: `Bạn có chắc chắn muốn xóa nhóm quyền ${nameApp} này không!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Đồng ý!'

    }).then(result => {
      if (result.value) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Xóa nhóm quyền thành công.',
          showConfirmButton: false,
          timer: 1500
        });
        this.deleteGroupRole(id);

      }
    });
  }

// connect user-role
  // connect user-role
  connectRoleUser(id)
  {
    // if (id == '' || id == null || id == undefined){
    //   Swal.fire({
    //     title:'Bạn không thể kết nối nhóm quyền với người dùng!',
    //     text: `Vui lòng lưu lại nhóm quyền trước khi kết nối.`,
    //     confirmButtonColor: '#0062AE',
    //     cancelButtonColor: '#f46a6a',
    //     confirmButtonText: 'Đồng ý!'
    //   });
    //   return ;
    // }
    const modalRef = this.modalService.open(ConnectUserRoleComponent, { size : 'lg'})
    modalRef.componentInstance.dtIdApp= this.idApp ;
    modalRef.componentInstance.dtIdGroupRole= id ;
    modalRef.result.then((reason)=>{
      console.log('id:',this.idApp,id);
      console.log('user role:',reason);
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

  saveSuccess() {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Lưu thành công',
      showConfirmButton: false,
      timer: 1500
    });
  }

  editSuccess()
  {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Sửa thành công',
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

  checkTabRole()
  {
    if (this.isDisabled == false){
      this.error();
      Swal.fire({
        title:'Bạn không thể tạo mới quyền!',
        text: `Vui lòng tạo mới app trước khi tạo quyền. `,
        confirmButtonColor: '#0062AE',
        cancelButtonColor: '#f46a6a',
        confirmButtonText: 'Đồng ý!'
      });
      this.activeTab = 'App';
    }
  }

  checkTabGroupRole()
  {
    // if (this.isDisabled == false || this.isDisabledRole == false){
    //   this.error();
    //   Swal.fire({
    //     title:'Bạn không thể tạo mới nhóm quyền!',
    //     text: `Vui lòng tạo mới app hoặc quyền trước khi tạo nhóm quyền. `,
    //     confirmButtonColor: '#0062AE',
    //     cancelButtonColor: '#f46a6a',
    //     confirmButtonText: 'Đồng ý!'
    //   });
    //   this.activeTab = 'App';
    // }
  }
 
}
