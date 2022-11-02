import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GroupRoleService } from '../service/group-role.service';
import { AddGroupRoleComponent } from './add-group-role/add-group-role.component';
import { PaginationComponent } from 'src/app/shared/components/pagination/pagination.component';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { ActivatedRoute } from '@angular/router';
import { ConnectUserRoleComponent } from '../connect-user-role/connect-user-role.component';


@Component({
  selector: 'app-group-role',
  templateUrl: './group-role.component.html',
  styleUrls: ['./group-role.component.scss']
})
export class GroupRoleComponent implements OnInit {

  groupRoleId:any=[];
  listRole: any=[];
  selectStatus: any[];
  listGroupRole: any = [];
  items:any = [] ;
  dataSource: any= [];
  listGroupRoleUpdate = [];
  id: any ;

  config = TreeviewConfig.create({
    hasFilter: true,
    hasCollapseExpand: true
  });

  constructor(
    private groupRoleService: GroupRoleService,
    private modalService : NgbModal,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) { 
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.selectStatus = [
      {id:1, name:'Kích hoạt'},
      {id:0, name:'Không kích hoạt'}
    ];

    this.getTreeRole(this.id);
  }

  formData:FormGroup = this.fb.group({
    appId: '' ,
    groupRole:['',[Validators.required]],
    status:['',[Validators.required]],
    description:[''],
    groupRoleId:[''],
    roleId:['']
  })

  get f(){
    return this.formData.controls;
  }

  getTreeRole(id)
  {
    this.groupRoleService.getAllRole(id).subscribe(data => {
      this.listRole= data.data;
      console.log("Domains",this.listRole);

    let parent = 1;
    let children = 1;
       
    this.dataSource = this.listRole.map(e => {
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

  onSubmit()
  {
   this.formData.value.appId = this.id ; 
    this.formData.value.roleId = this.groupRoleId;
    console.log('Group role',this.groupRoleId);
    console.log('FORM grou-p role:',this.formData,'\n', this.formData.value)
    this.listGroupRole.push(this.formData.value);
  }

  saveCreatGrouprole()
  {
    console.log('creater group role:',this.listGroupRole);

      this.groupRoleService.addGroupRole(this.listGroupRole).subscribe(data => {

        console.log('create role',data);
        this.listGroupRole.splice( this.listGroupRole);
        this.listGroupRoleUpdate = data.data;
        this.listGroupRoleUpdate.forEach(element => {
            this.listGroupRole.push(element);
        });
        this.success();

      }, error => {
        console.log(error)
        return  error;
      })
  }


  connectRoleUser(id)
  {
    const modalRef = this.modalService.open(ConnectUserRoleComponent, { size : 'lg'})
    modalRef.componentInstance.dtIdApp= this.id ;
    modalRef.componentInstance.dtIdGroupRole= id ;
    modalRef.result.then((reason)=>{;
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

  error() {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'Tạo mới thất bại',
      showConfirmButton: false,
      timer: 1500
    });
  }
   

}
