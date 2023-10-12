import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { AddGroupRoleComponent } from '../../group-role/add-group-role/add-group-role.component';
import { EditGroupRoleComponent } from '../../group-role/edit-group-role/edit-group-role.component';
import { EditRoleComponent } from '../../role/edit-role/edit-role.component';
import { ModalRoleComponent } from '../../role/modal-role/modal-role.component';
import { GroupRoleService } from '../../service/group-role.service';
import { RoleService } from '../../service/role.service';
import { UserService } from '../../service/user.service';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { ConnectUserRoleComponent } from '../../connect-user-role/connect-user-role.component';

@Component({
  selector: 'app-edit-app',
  templateUrl: './edit-app.component.html',
  styleUrls: ['./edit-app.component.scss']
})
export class EditAppComponent implements OnInit {
  index:any;
  idApp: number ; 
  isRoll:any= true;
  isGroupRoll:any= true;

  selectValue: any[];
  ListselectValue: any[]=[];
  inforApp: any = [];
  // role
  currentIndex = null;
  listRole: any = [];
  message: string;

  listGroupRole: any= [];

  roleIds:any=[];
  items:any = [] ;
  config = TreeviewConfig.create({
    hasFilter: true,
    hasCollapseExpand: true
  });
  dataSource: any= [];
  groupRoleId:any=[];
  value: any;
  currentIndexGroupRole = null;
  selectStatus: any[];
  selectParamId: any[];
  listTreeRole:any=[];
  messageError: string;
  constructor(
    private route: ActivatedRoute,
    private groupRoleService: GroupRoleService ,
    private roleSerVice: RoleService,
    private fb: FormBuilder,
    private userService: UserService,
    private modalService : NgbModal,
  ) { 
    this.index = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.selectStatus = [
      {id:1, name:'Kích hoạt', active: true},
      {id:0, name:'Không kích hoạt'}
    ];

     console.log('id app---:', this.index);

     this.getInforApp(this.index);
     this.getAllRole(this.index);
     this.getAllGroupRole(this.index);
     this.getParamRole();
  }

  activeTab:string = 'App';
  onTabClick(tab){
    this.activeTab = tab;
  }

  formData:FormGroup = this.fb.group({
    appName:['',[Validators.required]],
    appCode:['',[Validators.required]],
    privateKey:['',[Validators.required]],
    status:[null,Validators.required],
    description:['',[Validators.required]],
    hook: ['',[Validators.required]],
    appId:['']
  })

  get f(){
    return this.formData.controls;
  }

  getInforApp(id){
    this.groupRoleService.getIdApp(id).subscribe(data => {
      this.idApp = data.data.appId ;
      this.inforApp  = data.data;
      console.log('Infor app', data,'\t', this.idApp);
      console.log('Infor app', this.inforApp);
      this.formData.patchValue(this.inforApp);
    }, error => {
      console.log(error);
    })
  }

  onSubmit()
  {
      this.formData.value.status = parseInt(this.formData.value.status);
      console.log('edit :',this.formData.value );
      this.userService.editApp(this.formData.value).subscribe(data => {
      this.success();
      //this.route.navigate(['/domain'])     
      }, error => {
        console.log(error);
        this.error();
      })
  }

  // ------ role
  showListRole(){
    if(this.isRoll){
      this.isRoll = false
    }
    else{
      this.isRoll = true
    }
  }
  formRole:FormGroup = this.fb.group({
      appId:'',
      role:['',[Validators.required]],
      roleCode:['',[Validators.required]],
      status:[null,Validators.required],
      description:[''],
      systemParamId: null
    })

  get fRole(){
    return this.formRole.controls;
  }
  
  getParamRole()
  { 
    this.roleSerVice.getAllParamID().subscribe(data => {
      console.log ("submit:", data);
      this.selectParamId = data.data;  
    }, error => {
        console.log(error);
      return ;
    })
  }

  getAllRole(id){
    this.roleSerVice.getAllRole(id).subscribe(data => {
      this.listRole = data.data;
      console.log('list role id:',this.listRole);
    }, error => {
      console.log(error);
    })
  }

  openAddRole()
  {
       const modalRef = this.modalService.open(ModalRoleComponent, { size : 'lg'})
      modalRef.componentInstance.dtIdApp= this.idApp ;
      modalRef.result.then((reason)=>{
      if(reason == "Close click")
      {
        return
      }
      else
      {
        const role = this.listRole.find((e) => e.role === reason.role);
        if (role){
          console.log('Tên quyền đã tồn tại');
          this.message = 'Tên quyền đã tồn tại, vui lòng nhập lại tên quyền!';
          return ;
        }
    
        const code = this.listRole.find((e) => e.roleCode === reason.roleCode);
        if (code){
          console.log('Mã quyền đã tồn tại');
          this.message = 'Mã quyền đã tồn tại, vui lòng nhập lại mã quyền!';
          return ;
        }

        this.message = "";

         this.listRole.push(reason);
          console.log('list role',this.listRole);
      }
 
    })
  }

  resetRole()
  {
    this.currentIndex = null;
    this.formRole.reset({
      roleId:'',
      appId:'',
      role:'',
      roleCode:'',
      status:'',
      description:'',
      systemParamId:''
    })
  }

  createRole(tbody)
  {
    this.roleSerVice.addRole(tbody).subscribe(data =>{
      console.log('creat role:', data.data);
      this.getAllRole(this.index);
      this.success();
    },error =>{
      return error
    })
  }
  
  saveRole()
  {
    this.listRole.map(e =>{return (delete e.groupRoleId,
      e.appId = this.idApp
      )});
    console.log("list Role:", this.listRole);
    this.roleSerVice.editRole(this.listRole).subscribe(data =>{
      this.success();
    }, error =>{
      console.log(error);
      this.error();
      return ;
    })
  }

  // edit role
  openEditRole(data)
  {
    // this.currentIndex != null;
    // this.currentIndex = index;
    // this.formRole.patchValue(this.listRole[index]);
    // console.log(index);
    // console.log('data', this.listRole[index]);
    console.log(  'role', data);
    const modalRef = this.modalService.open(EditRoleComponent, { size : 'lg'})
    modalRef.componentInstance.dtRole= this.listRole[data] ;
    modalRef.componentInstance.dtIdRole= this.index ;
    modalRef.result.then((reason)=>{

    if(reason == "Close click")
      return
    else
      console.log('data', reason);
      this.listRole.splice(data,1,reason);
      console.log('list role--', this.listRole);
    })
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

    //----------group role-----------
    getTree()
    {
      this.getTreeRole(this.idApp);
    }

    getTreeRole(id)
    {
     this.groupRoleService.getAllRole(id).subscribe(data => {
       this.listTreeRole= data.data;
      //  this.listRole= this.listTreeRole.map(e => e.systemParam)
      //   console.log("Domains",this.listTreeRole);
  
      this.dataSource =this.listTreeRole.map(e => {
        e.text = e.systemParam;
         e.value = e.systemParamId;
        e.children = e.roleRes ?  e.roleRes.map(k => {
          return {
            text: k.role,
            value: k.roleId
          }
        }) : null;  
          return {
                   text:e.text,
                   value: e.value,
                   children:e.children               
                  }
      }) ; 
      console.log('---',this.dataSource);
   
      this.items = this.getItems(this.dataSource);
      }, error => {
        console.log(error);
        
      })
  
       
    }

    getItems(parentChildObj) {
      let itemsArray = [];
      parentChildObj.forEach(set => {
        itemsArray.push(new TreeviewItem(set))
      });
      return itemsArray;
    }
  
    onFilterChange(value: string): void {
      console.log('filter:', value);
    }
  
    onSelectedChange(value: string): void {
      this.groupRoleId = value;
      console.log ('inđẽ tree',  this.groupRoleId ); 
    }
    
  // showListGroupRole(){
  //   if(this.isGroupRoll){
  //     this.isGroupRoll = false
  //   }
  //   else{
  //     this.isGroupRoll = true
  //   }
  // }

  formGroupRole:FormGroup = this.fb.group({
    groupRole:['',[Validators.required]],
    status:[null,Validators.required],
    description:[''],
    groupRoleId:[''],
    roleId:['']
  })

  get fGroup(){
    return this.formGroupRole.controls;
  }

  getAllGroupRole(id){
    this.groupRoleService.getAllGroupRole(id).subscribe(data => {
      console.log('list group role:',data.data);
      this.listGroupRole = data.data;

    }, error => {
      console.log(error);
    })
  }

  // submitGroupRole()
  // {
     
  //   if(this.currentIndexGroupRole == null)
  //   {
  //     const role = this.listGroupRole.find((e) => e.groupRole === this.formGroupRole.value.groupRole);
  //     if (role){
  //       console.log('Tên nhóm quyền đã tồn tại');
  //       this.messageError = 'Tên nhóm quyền đã tồn tại, vui lòng nhập lại tên nhóm quyền!';
  //       return ;
  //     }
  //     this.formGroupRole.value.roleId = this.groupRoleId;

  //     console.log('Group role',this.groupRoleId.value);
  //     console.log('Group role form-----',this.formGroupRole.value);
  //     this.listGroupRole.push(this.formGroupRole.value);
  //     this.listGroupRole;
  //     this. resetGroupRole();
      
  //   }else{
  //     this.formGroupRole.value.roleId = this.groupRoleId;
  //     this.listGroupRole.splice(this.currentIndexGroupRole, 1, this.formGroupRole.value);
  //     console.log('Group role',this.formGroupRole.value)
  //     this. resetGroupRole();
  //   }
  // }
  
  resetGroupRole()
  {
    this.currentIndexGroupRole = null;
    this.formGroupRole.reset({
      groupRole:'',
      status:'',
      description:'',
      groupRoleId:'',
      roleId:''
    })
  }
  createGroupRole(tbody)
  {
    this.groupRoleService.addGroupRole(tbody).subscribe(data =>{
      console.log('creat role:', data.data);
      this.getAllGroupRole(this.index);
      this.success();
    },error =>{
      return error
    })
  }

  saveGroupRole()
  {
    console.log('group role before delete', this.listGroupRole)
    const a = this.listGroupRole.map(data=> {
      // const b = data.role?data.role.map(e =>{
      //             return e.roleId
      // }): data.roleId;
      const b = data.role?data.role.map(e =>{
        return e.roleId
      }): data.roleId;
      return {
          groupRoleId: data.groupRoleId,
          groupRole: data.groupRole,
          groupRoleCode: data.groupRoleCode,
          description: data.description,
          status: data.status,
          roleId: b
      }
      }); 
      console.log('--------save group role',a)

    this.groupRoleService.editGroupRole(this.idApp,a).subscribe(data =>{
      console.log ("submit group:",data);
      this.getAllGroupRole(this.index);
      this.successGroupRole();
    }, error =>{
      console.log(error);
      this.error();
      return ;
    })
  }

  openAddGroupRole()
  {
    const modalRef = this.modalService.open(AddGroupRoleComponent, { size : 'lg'})
    // modalRef.componentInstance.dtGroupRole = this.listGroupRole[index] ;
    modalRef.componentInstance.dtIdApp= this.index ;
   // console.log('dtidapp:',this.index);
    modalRef.result.then((reason)=>{
      const tbody = reason ; 
      console.log('edit group role:',reason );
      if(reason == "Close click")
        return
      else
      {
        const role = this.listGroupRole.find((e) => e.groupRole === reason.groupRole);
        const roleCode = this.listGroupRole.find((e) => e.groupRoleCode === reason.groupRoleCode);
        if (role){
          console.log('Tên nhóm quyền đã tồn tại');
          this.messageError = 'Tên nhóm quyền đã tồn tại, vui lòng nhập lại tên nhóm quyền!';
          return ;
        }else if (roleCode){
          console.log('Mã nhóm quyền đã tồn tại');
          this.messageError = 'Mã nhóm quyền đã tồn tại, vui lòng nhập lại mã nhóm quyền!';
          return ;
        }
        else{
          this.messageError = "";
        }
         this.listGroupRole.push(reason);
      }
       
     
    })
    // this.currentIndexGroupRole != null;
    // this.currentIndexGroupRole = index;
    // const tree = this.listGroupRole[index].role.map(e =>{
    //   return e.roleId;
    // }) ; 
    // console.log('tree---', tree);
    // this.formGroupRole.value.roleId.patchValue(tree);
  
    // this.getTreeRole(this.listGroupRole[index]);
    // this.currentIndexGroupRole != null;
    // this.currentIndexGroupRole = index;
    // console.log('patch treeview:',this.listGroupRole[index]);
    // this.formGroupRole.patchValue(this.listGroupRole[index]);
  }

  openEditGroupRole(index)
  {
    const modalRef = this.modalService.open(EditGroupRoleComponent, { size : 'lg'})
    modalRef.componentInstance.dtGroupRole = this.listGroupRole[index] ;
    modalRef.componentInstance.dtIdApp= this.index ;
    console.log('dtidapp:',this.index);
    modalRef.result.then((reason)=>{
      const tbody = reason ; 
      console.log('edit group role:',reason );
      if(reason == "Close click")
        return
      else
      {
        this.messageError = "";
        this.listGroupRole.splice(index,1,reason);     
      }

       
     
    })
    this.currentIndexGroupRole != null;
    this.currentIndexGroupRole = index;

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

  connectRoleUser(id)
  {
    if (id == '' || id == null || id == undefined ){
      Swal.fire({
        title:'Bạn không thể kết nối nhóm quyền với người dùng!',
        text: `Vui lòng lưu lại nhóm quyền trước khi kết nối.`,
        confirmButtonColor: '#0062AE',
        cancelButtonColor: '#f46a6a',
        confirmButtonText: 'Đồng ý!'
      });
      return ;
    }
    const modalRef = this.modalService.open(ConnectUserRoleComponent, { size : 'lg'})
    modalRef.componentInstance.dtIdApp= this.idApp ;
    modalRef.componentInstance.dtIdGroupRole= id ;
    modalRef.result.then((reason)=>{
      console.log('id:',this.idApp,id);
      console.log('user role:',reason);
    })
  }


  successGroupRole() {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Lưu nhóm quyền thành công',
      showConfirmButton: false,
      timer: 1500
    });
  }

  success() {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Sửa app thành công',
      showConfirmButton: false,
      timer: 1500
    });
  }

  error() {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'Sửa domain thất bại',
      showConfirmButton: false,
      timer: 1500
    });
  }

}
