import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GroupRoleService } from '../../service/group-role.service';
import Swal from 'sweetalert2';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';

@Component({
  selector: 'app-edit-group-role',
  templateUrl: './edit-group-role.component.html',
  styleUrls: ['./edit-group-role.component.scss']
})
export class EditGroupRoleComponent implements OnInit {
  //items!: TreeviewItem[];
  items:any = [] ;
  config = TreeviewConfig.create({
    hasFilter: true,
    hasCollapseExpand: true
  });

  selectStatus: any[];
  message: string ;
  err: boolean = false;
  inforRole: any;
  @Input() dtGroupRole: any ;

  listRole: any=[];
  groupRoleId:any=[];
  dataSource: any= [];
  id:number;

  constructor(
    private fb: FormBuilder,
    private groupRoleService: GroupRoleService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    console.log('index',this.dtGroupRole);
    this.selectStatus = [
      {id:1, name:'Kích hoạt', active: true},
      {id:0, name:'Không kích hoạt'}
    ]; 

    this.id = 1; 
    
    this.getTreeRole(this.id);
    
    console.log('edit group role',this.dtGroupRole);

    this.formData.patchValue(this.dtGroupRole);

  }

  getTreeRole(id)
  {
    this.groupRoleService.getAllRole(this.id).subscribe(data => {
    this.listRole= data.data;
    console.log("Domains",this.listRole);

    const dataSource= [];
    let parent = 1;
    let children = 1;
    // this.listRole.forEach(e =>{
    //   dataSource.push({
    //     text: e.systemParam,
    //     value:  e.roleRes,
    //     data: {
    //       parent: true,
    //       id: e.roleRes
    //    }
    //   });

    //   parent++;

    // })

    
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


    // console.log('datasouce:',dataSource);
    // this.items = this.getItems(dataSource);
    // this.groupRoleId = this.items.groupRoleId;
    // console.log('--', this.groupRoleId);
    // }, error => {
    //   console.log(error);
      
    // })
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
    console.log(this.groupRoleId)
  }

  formData:FormGroup = this.fb.group({
    groupRole:['',[Validators.required]],
    status:['',[Validators.required]],
    description:[''],
    groupRoleId:[''],
    roleId:['']
    
  })

  get f(){
    return this.formData.controls;
  }

  onSubmit()
  {
    console.log('ssss',this.groupRoleId);
    const roleIdList = [];
    for (const item of this.groupRoleId) {
      for (const childItem of item) {
        roleIdList.push(childItem.roleId);
      }
    }
     this.formData.value.roleId = roleIdList;
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
