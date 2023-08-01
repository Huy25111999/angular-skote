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
    hasCollapseExpand: false,
    hasAllCheckBox: false,
    decoupleChildFromParent: true,
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
    this.loadParent();
    this.items = [new TreeviewItem({
      text: "Quản trị hệ thống",
      value: 9,

      children: [
        {
          text:"Cơ cấu tổ chức",
          value: 1,
          children:[
          ],
        },
        {
          text: "Hệ thống chức danh",
          value: 2,
        },
        {
          text: "Định biên",
          value: 3,
        },
      ],
    })];
    
  }

  getTreeRole(id)
  {
    this.groupRoleService.getAllRole(id).subscribe(data => {
      this.listRole= data.data;
      console.log("Domains",this.listRole);

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
    groupRoleCode:['',Validators.required],
    parentId: [''],
    unitId: [null, [Validators.required]]
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

  // Tree depart -select
  fullList: any[] = [];
  listParent: any[] = [];
  parentId:any = null;
  loadParent(){
    let newArr = [];
    const data = [
      {unitId: 327, parentId: null, name:'sso', code:'sso'},
      {unitId: 328, parentId: 327, name:'abcs', code:'ABCS'},
      {unitId: 331, parentId: 327, name:'Thanh Hoa', code:'TH'},
      {unitId: 329, parentId: 328, name:'abcsefgh', code:'ABCSghi'},
      {unitId: 330, parentId: null, name:'Ha Noi', code:'HN'}
    ]
    this.fullList = data.map(e =>{
      return {
        ...e,
        text: `${e.name ? e.name + (e.code ?'-':''):''} ${e.code ? `${e.code}`:''}`,
        title: `${e.name ? e.name + (e.code ?'-':''):''} ${e.code ? `${e.code}`:''}`,
        value: e.unitId,
        key: e.unitId,
        parentId: e.parentId
      }
    })

    newArr = data.map(e =>{
      return {
        ...e,
        text: `${e.name ? e.name + (e.code ?'-':''):''} ${e.code ? `${e.code}`:''}`,
        title: `${e.name ? e.name + (e.code ?'-':''):''} ${e.code ? `${e.code}`:''}`,
        value: e.unitId,
        key: e.unitId,
      }
    })

    let arr: any = newArr.filter(e => !e.parentId);
    this.mapChild(arr,  newArr);
    this.listParent = arr;
    console.log("this.listParent", this.listParent);
    
    this.listParent = arr.map(e => new TreeviewItem(e));
  }

  mapChild(need:any, array: any){
    for(let i = 0; i <need.length; i++){
      const obj:any = need[i];
      obj.text = `${obj.name ? obj.name + (obj.code ?'-':''):''} ${obj.code ? `${obj.code}`:''}`;
      obj.title = `${obj.name ? obj.name + (obj.code ?'-':''):''} ${obj.code ? `${obj.code}`:''}`;
      obj.value = obj.unitId;
      obj.key = obj.unitId;
      const child = array.filter(e => e.parentId === obj.unitId);
      if(child.length === 0){
        obj.isLeaf = true;
        continue;
      }else{
        obj.children = child.map( e =>{
          return {
            ...e,
            text: `${e.name ? e.name + (e.code ?'-':''):''} ${e.code ? `${e.code}`:''}`,
            title: `${e.name ? e.name + (e.code ?'-':''):''} ${e.code ? `${e.code}`:''}`,
            value: e.unitId,
            key: e.unitId,
          }
        })
      }
      this.mapChild(obj.children, array)
    }
  }

  onValueChange(event){
    console.log("event", event);
   // this.formData.get('parentId').setValue(event);
    this.parentId = event
  }


}
