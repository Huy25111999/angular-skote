import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GroupRoleService } from '../../service/group-role.service';
import Swal from 'sweetalert2';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { BookService } from 'src/app/services/book.service';


@Component({
  selector: 'app-edit-group-role',
  templateUrl: './edit-group-role.component.html',
  styleUrls: ['./edit-group-role.component.scss']
})
export class EditGroupRoleComponent implements OnInit {
  //items!: TreeviewItem[];
  //items!: TreeviewItem[];
  items:any = [] ;
  tree:any=[];
  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 300
  });

  selectStatus: any[];
  message: string ;
  err: boolean = false;
  inforRole: any;
  @Input() dtGroupRole: any ;
  @Input() dtIdApp: any ;

  listRole: any=[];
  groupRoleId:any=[];
  dataSource: any= [];
  id:number;
  dataGroup: any = [];
//------------treeeview
@Input() controlName: FormControl
@Output() change = new EventEmitter<any[]>();
buttonClass = 'btn-outline-secondary';
lstKpi: TreeviewItem[] = [];
lstObject: any[] = [];
getRoleId: any =[];
value: any;

  constructor(
    private fb: FormBuilder,
    private groupRoleService: GroupRoleService,
    public activeModal: NgbActiveModal,
    private bookService: BookService
  ) { }

  ngOnInit(): void {
    console.log('index',this.dtGroupRole, this.dtIdApp);
    this.selectStatus = [
      {id:1, name:'Kích hoạt', active: true},
      {id:0, name:'Không kích hoạt'}
    ]; 

    this.getTree(this.dtIdApp);
    
    this.formData.patchValue(this.dtGroupRole);

    // node
    // if (this.dtGroupRole.role){
    //   this.getRoleId = this.dtGroupRole.role.map((e: any)=>{ return e.roleId});
    //   console.log( 'getrole', this.getRoleId);
    //   this.formData.value.roleId = this.getRoleId;
    // }
    // const value = this.formData.value.roleId;
    // console.log('--------form',this.formData.value);

   
    // this.items.forEach(e => { 
    //   e.checked = false;
    //   if (e.children)
    //   {
       
    //     e.children.forEach(item => { 
    //       item.checked = false;
    //        if(item.value == value){
    //           item.checked = true;
    //         } 

    //         if(item.children)
    //         {
    //           let count = 0;
    //           item.children.forEach(k =>{
                
    //             k.checked = false;
    //             for ( let i =0; i<value.length;i++)
    //             {
    //               if(k.value == value[i]){
    //                 k.checked = true;
    //                 count += 1;
    //               }
                  
    //             } 
                    
    //           })
    //           if (count == item.children.length){
    //             item.checked = true;
    //           }
    //         } 
             
           
    //     })        
    //   }

    //  })


   // this.loadObject(this.dtIdApp);
  }
  //  load data
  getTree(id)
  {
    this.groupRoleService.getAllRole(id).subscribe(data => {
      this.listRole= data.data;
      this.getTreeRole();
      console.log("Domains",this.listRole);
    }),error =>{
      console.log(error);
    }
  }
  getTreeRole()
  {
    const dataSource= [];
    let parent = 1;
    let children = 1;

    this.dataSource = this.listRole.map(e => {
      e.text = e.systemParam;
     // e.value = e.systemParamId;
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
   // this.items = [new TreeviewItem(this.dataSource)];
    this.items = this.getItems(this.dataSource);
    console.log('items',this.items);
      // node
      if (this.dtGroupRole.role){
        this.getRoleId = this.dtGroupRole.role.map((e: any)=>{ return e.roleId});
        console.log( 'getrole', this.getRoleId);
        this.formData.value.roleId = this.getRoleId;
      }
      const value = this.formData.value.roleId;
      console.log('--------form',this.formData.value);
  
      this.items.forEach(e => { 
        e.checked = false;
        if (e.children)
        {
         let count = 0;
          e.children.forEach(item => { 
            item.checked = false;
             if(item.value == value){
                item.checked = true;
              } 
              
              for ( let i =0; i<value.length;i++)
              {
                if(item.value == value[i]){
                  item.checked = true;
                  count += 1;
                } 
              } 
              // if (count == e.children.length){
              //     e.checked = true;
              //   }
  
              if(item.children)
              {
                let count = 0;
                item.children.forEach(k =>{
                  
                  k.checked = false;
                      
                })
              } 
               
             
          })   
          if (count == e.children.length){
            e.checked = true;
          }
 
        }
  
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
    let arr:any = [];
    arr = value;
    console.log('arr', arr);

    // for (  let i in arr){
    //   if(arr[i] == undefined){
    //       arr.splice(i,1);
    //   }
    // }

    let filterValueTree = arr.filter(e =>{
      return e !== undefined
    })
    
    this.groupRoleId = filterValueTree;
  }


  formData:FormGroup = this.fb.group({
    groupRole:['',[Validators.required]],
    status:[null,Validators.required],
    description:[''],
    groupRoleId:[''],
    roleId:[''],
    appId:[''],
    groupRoleCode:['',Validators.required] 
  })

  get f(){
    return this.formData.controls;
  }


  onSubmit()
  {
    console.log('ssss',this.groupRoleId);
    this.formData.value.appId = this.dtIdApp;
    this.formData.value.roleId = this.groupRoleId;
    this.activeModal.close(this.formData.value);
  }

// ----------Tree

onSelectedChangeKpi(value: any) {
  if (value) {
    this.formData.setValue(value);
    this.value = value;
  } else {
    this.formData.setValue(null);
    this.value = null;
  }
}

onFilterChangeKpi($event: string) {
}

loadObject(id) {
  this.groupRoleService.getAllRole(id).subscribe(res => {
      this.lstObject = res.data;
      console.log('list object1:', this.lstObject);
      // this.lstObject = this.items.map(e =>{ new TreeviewItem(e)})
      this.lstObject = this.lstObject.map(e =>{ new TreeviewItem(e)})
      console.log('list object2:', this.lstObject);
  })

  }

  changeValue(lstParent) {
    lstParent.forEach(e => {
      if (e.value)
        e.value = e.value.toString()
      if (e.children) {
        const lstChild = e.children;
        this.changeValue(lstChild);
      }
    });
  }
  updateCheckTree(lstParent, value: string[] , lstData?) {
    lstParent.forEach(e => {
      if (value.indexOf(e.value.id) !== -1) {
        e.checked = true;
        lstData.checked = true;
        this.updatePrentLst(this.lstKpi)
      }
      if (e.children) {
        const lstChild = e.children;
        this.updateCheckTree(lstChild, value , e);
      }
    });
  }
  updatePrentLst(lstParent) {
    lstParent.forEach(e => {
      if (e.children)
        e.children.forEach(children => {
          if (children.checked === true) {
            e.checked = true;
          }
        })
    })
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
