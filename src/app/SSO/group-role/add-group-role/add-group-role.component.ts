import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GroupRoleService } from '../../service/group-role.service';
import { RoleService } from '../../service/role.service';
import Swal from 'sweetalert2';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
@Component({
  selector: 'app-add-group-role',
  templateUrl: './add-group-role.component.html',
  styleUrls: ['./add-group-role.component.scss']
})
export class AddGroupRoleComponent implements OnInit {
 // items!: TreeviewItem[];
  items:any = [] ;
  config = TreeviewConfig.create({
    hasFilter: true,
    hasCollapseExpand: true,
    maxHeight: 300
  });
  
  @Input() dtIdApp: any ;
  listRole: any=[];
  dataSource: any= [];
  values: number;
  paramItem:any;

  defaultValue;
  groupRoleId:any=[];
  roleId;
  arr:any= [] ;
  // roleIdList = [];

  selectStatus: any[];
  message: string ;
  err: boolean = false;
  id:number;

  constructor(
    private fb: FormBuilder,
    private groupRoleService: GroupRoleService,
    private roleService: RoleService, 
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    
    console.log('dtIdRole:', this.dtIdApp);
    this.selectStatus = [
      {id:1, name:'Kích hoạt', active: true},
      {id:0, name:'Không kích hoạt'}
    ]; 
    this.defaultValue = 1
    this.getTreeRole(this.dtIdApp);
  
    // this.items = [new TreeviewItem({
    //   text: "Quản trị hệ thống",
    //   value: 9,

    //   children: [

    //     {
    //       text:"Cơ cấu tổ chức",
    //       value: 1,
    //       children:[
    //       ],
    //     },
    //     {
    //       text: "Hệ thống chức danh",
    //       value: 2,
    //     },
    //     ,
    //     {
    //       text: "Định biên",
    //       value: 3,
    //     },
    //   ],
    // })];
    
  }

  getTreeRole(id)
  {
    this.groupRoleService.getAllRole(id).subscribe(data => {
      this.listRole= data.data;
    //  this.listRole= data.data.map(e => e.systemParam)
      console.log("Domains",this.listRole);

    let parent = 1;
    let children = 1;
    // this.listRole.forEach(e =>{
      

    //   const childrens = e.roleRes;
    //   console.log('---',childrens);

    //   dataSource.push({
    //     text: e.systemParam,
    //     value:  e.roleRes,
    //     data: {
    //       parent: true,
    //       id: e.roleRes
    //    },children:e.roleRes:e.
    //   });
      
    //   if(childrens.length >0)
    //   {
    //     childrens.forEach(subitem =>{
    //       dataSources.push({
    //         text:subitem.role,
    //         value: subitem.roleId
    //       });         
    //       children ++;
    //     })
    //   }
    //   else{
    //     return dataSource;
    //   }

    //   parent++;

    // })
       
    this.dataSource = this.listRole.map(e => {
      e.text = e.systemParam;
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
    this.items.forEach(e => { 
      e.checked = false;
      if (e.children)
      {
        e.children.forEach(item => { item.checked = false;
          if(item.children){
            item.children.forEach(k =>{
              k.checked = false
            })
          }
        })
      }

     })
     console.log('tree',this.items);

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

  formData:FormGroup = this.fb.group({
    appId: '' ,
    groupRole:['',[Validators.required]],
    status:[null,Validators.required],
    description:[''],
    groupRoleId:[''],
    roleId:[''],
    groupRoleCode:['',Validators.required] 
  })

  get f(){
    return this.formData.controls;
  }

  onFilterChange(value: string): void {
    console.log('filter:', value);
  }

  onSelectedChange(value: string): void {
    let arr:any = [];
    arr = value;
    console.log('arr', arr);

    let filterValueTree = arr.filter(e =>{
      return e !== undefined
    })

    console.log(filterValueTree);
    
    this.groupRoleId = filterValueTree;
    console.log ('inđẽ tree',  this.groupRoleId ); 
  }

  onSubmit()
  {
  //  const roleIdList = [];
  //   for (const item of this.groupRoleId) {
  //     for (const childItem of item) {
  //       roleIdList.push(childItem.roleId);
  //     }
  //   }
   // this.roleId = this.groupRoleId.map(e=>e.roleId)
   this.formData.value.appId = this.dtIdApp ; 
    this.formData.value.roleId = this.groupRoleId;
    console.log('Group role',this.groupRoleId);
    console.log('FORM grou-p role:',this.formData,'\n', this.formData.value)
     this.activeModal.close( this.formData.value );
  }

  closeModal(){
    Swal.fire({
      text: 'Dữ liệu nhập chưa được lưu lại, bạn có muốn đóng tab không?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText:  'Đồng ý',

    }).then(result => {
      if (result.value) {
          this.activeModal.close('Close click'); 
      }
    });
  }

}


    //  this.message = '' ;
    //  this.err = false ; 
    // this.groupRoleService.addGroupRole(this.formData.value).subscribe(data => {
    //   console.log ("submit:", this.formData.value);
    //   this.activeModal.dismiss(this.formData.value);
    //   this.activeModal.close('Close click');   
      
    // }, error => {
    //   this.err = true ; 
    //   this.message = error ; 
    //   console.log(this.message);
    //   return ;
    // })