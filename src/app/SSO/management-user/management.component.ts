import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { ModalAddComponent } from './modal-add/modal-add.component';
import { ModalEditComponent } from './modal-edit/modal-edit.component';
import { ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../service/user.service';
import { infor } from '../../model/infor';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FilterModule } from 'ng2-smart-table/lib/components/filter/filter.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { Router } from '@angular/router';
import { GroupRoleService } from '../service/group-role.service';
import * as moment from 'moment';
import { omit } from 'lodash'; 
import { Observable, Subject, of } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
export const TIME_OUT = {
  DUE_TIME_SEARCH : 1000
}

export const STATUS_CODE = {
  SUCCESS: 200,
  CREATED: 201,
  NOT_FOUND_DATA: 204,
  BAD_REQUEST: 400,
  AUTH: 401,
  METHOD_NOT_ALLOWED: 405,
  EXIST:409,
  CONFIRM: 419,
  ARG_INVALID: 422,
  SERVER_ERROR: 500
}
@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})

export class ManagementUserComponent implements OnInit
{
  POSTS: any;
  page: number = 1;
  pageSize = 10;
  count: number = 0;
  tableSize: number = 3;
  tableSizes: any = [3, 6, 9, 12];

  fullName:string = '';
  email:string = '';
  totalElements:number;

  token : any;

//--------
  // listUsers : infor[]= [];
  listUsers : any[] = [
    {
      id: 41,
      fullName: "Joan",
      email: "Brown",
      username: "jbrown",
      phone: "Canada",
  },
  {
      id: 40,
      fullName: "Mort",
      email: "Johnston",
      username: "morty",
      phone: "Canada",
  },
  {
      id: 42,
      fullName: "Sally",
      email: "Johns",
      username: "smothers",
      phone: "Canada",
  },
  {
      id: 39,
      fullName: "Kat",
      email: "Preston",
      username: "kipreston",
      phone: "United States",
  },
  {
      id: 34,
      fullName: "James",
      email: "Preston",
      username: "jpreston",
      phone: "United States",
  },
  {
      id: 43,
      fullName: "Anya",
      email: "Promaski",
      username: "anyapro",
      phone: "United States",
  },
  {
      id: 44,
      fullName: "Elena",
      email: "Savkin",
      username: "esavkin",
      phone: "United States",
  },
  {
      id: 45,
      fullName: "Johan",
      email: "Severson",
      username: "jsever",
      phone: "United States",
  },
  {
      id: 46,
      fullName: "Kathya",
      email: "Smith",
      username: "ksmith",
      phone: "United States",
  }
  ];
  oneUser: infor[] = [];
  searchValue : string;
  infors:infor[] ;

  public user =[];
  closeResult: string;
  searchText: any;
  viewText : string="Quản lý user";

  selectedApp: any[];
  selectGroupRoleId: any[];
  idApp: number;
  idGroupRole: number;
  selectStatus: any[];

  constructor(
    private userService: UserService,
    private groupRoleService: GroupRoleService,
    private modalService : NgbModal,
    private fb: FormBuilder,
    private router:Router
    ) {
    }

  ngOnInit(): void {

    this.selectStatus = [
      {id:1, name:'Kích hoạt', active: true},
      {id:0, name:'Không kích hoạt'}
    ];
    //AutoComplete
    this.listUserCopy = JSON.stringify(this.listUsers);
    this.debounceOnSearch();

    this.onSearch(false);
   // this.getToken();
    this.getIdApp();
   // this.getGroupRole();
    this.formData.patchValue({
      status: "1"
    })
  }

  getToken(){
    this.token = localStorage.getItem('auth');
  }


  //Open modal
   openModalAdd(data)
  {
    const modalRef = this.modalService.open(ModalAddComponent, { size : 'lg'})
    modalRef.componentInstance.listUsers== data ;
    modalRef.result.then((data)=>{

    },(reason)=>{
      data = reason;
      this.onSearch(true) ;
    })
  }


  openModalEdit(data)
  {
    const modalRef = this.modalService.open(ModalEditComponent, {size : 'lg'})
    modalRef.componentInstance.dtUser = data;
    modalRef.result.then((data) => {
    }, (reason) => {
      data = reason;
      this.onSearch(true) ;
    })

  }


  // public formData:FormGroup = new FormGroup({
  //   fullName: new FormControl(''),
  //   email: new FormControl(''),
  //   appId: new FormControl(null),
  //   groupRoleId: new FormControl(null),
  //   username: new FormControl(''),
  //   phone: new FormControl('',[Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
  //   status: new FormControl(null),
  //   pageNumber: new FormControl(''),
  //   pageSize: new FormControl(''),
  //   noStatus: new FormControl(null)
  // })

  formData:FormGroup = this.fb.group({
    fullName: [null],
    email: [null],
    appId: [null],
    groupRoleId: [null],
    username: [null],
    phone: [null,[Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
    status: 1,
    pageNumber: [null],
    pageSize: [null],
    noStatus: [null],
    invoiceTemplateId: [null]
  })
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
   
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  // Get all user
  // getListUsers()
  // {
  //   this.postService.getAllUsers().subscribe(data => {
  //     console.log(data);
  //     this.listUsers = data.data.content;
  //     console.log('list: ',this.listUsers);
  //   }, error => {
  //     console.log(error);

  //   })
  // }

// ___________Tim kiếm phân trang

/*
   searchName()
  {
    if(this.username == '')
    {
      this.getListUsers();
    }
    else
    {
      this.listUsers = this.listUsers.filter( res=>{
        return res.username.toLocaleLowerCase().match(this.username.toLocaleLowerCase());
      })
    }
  }

*/

//Pageination


  onSearch(flag)
  {
    this.formData.value.pageNumber = this.page -1 ;
    this.formData.value.pageSize = this.pageSize;
   
    this.userService.search(this.formData.value).subscribe(data => {
      this.listUsers = data.data.content;
      this.totalElements = data.data.totalElements;
      this.listUserCopy = JSON.stringify(data.data.content); 
    }, error => {
      //this.router.navigate(['/account/login']);
      this.listUsers = [
        {
          id: 41,
          fullName: "Joan",
          email: "Brown",
          username: "jbrown",
          phone: "Canada",
      },
      {
          id: 40,
          fullName: "Mort",
          email: "Johnston",
          username: "morty",
          phone: "Canada",
      },
      {
          id: 42,
          fullName: "Sally",
          email: "Johns",
          username: "smothers",
          phone: "Canada",
      },
      {
          id: 39,
          fullName: "Kat",
          email: "Preston",
          username: "kipreston",
          phone: "United States",
      },
      {
          id: 34,
          fullName: "James",
          email: "Preston",
          username: "jpreston",
          phone: "United States",
      },
      {
          id: 43,
          fullName: "Anya",
          email: "Promaski",
          username: "anyapro",
          phone: "United States",
      },
      {
          id: 44,
          fullName: "Elena",
          email: "Savkin",
          username: "esavkin",
          phone: "United States",
      },
      {
          id: 45,
          fullName: "Johan",
          email: "Severson",
          username: "jsever",
          phone: "United States",
      },
      {
          id: 46,
          fullName: "Kathya",
          email: "Smith",
          username: "ksmith",
          phone: "United States",
      }
      ];

    })

  }

  convertDateTime(date)
  {
    // let now =moment(date);
    // return now.format("YYYY/MM/DD hh:mm:ss");
    let utcDate =moment.utc(date);
    let localDate = moment(utcDate).local();
    return localDate.format("YYYY/MM/DD HH:mm:ss");
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

  // ---------select 
  // get name app
  getIdApp()
  {
    this.userService.getNameApp().subscribe(data => {
      this.selectedApp = data.data;
      console.log('Infor user : ',this.selectedApp)
    }, error => {
      console.log(error);
    })
  }

  nodeApp(event){
    this.idApp = event.appId;
 }

 nodeGroupRole(event){
  this.idGroupRole = event.groupRoleId;

}

 listAppGroupRole()
 {
  console.log('id app----:',this.idApp);
  this.getGroupRole(this.idApp);
 }

  getGroupRole(id)
  {
    this.groupRoleService.getAllGroupRole(id).subscribe(data => {
      this.selectGroupRoleId = data.data;
      console.log('---group role---,',this.selectGroupRoleId)
    }, error => {
      console.log(error);
    })
  }

  onReset()
  {
    this.formData.reset({
      fullName:'',
      email:'',
      username:'',
      phone:'',
    })
  }

  // getGroupRole()
  // {
  //   this.userService.getNameApp().subscribe(data => {
  //     this.selectAppId = data;
  //     console.log('Infor user : ',this.oneUser)
  //   }, error => {
  //     console.log(error);
  //   })
  // }

  // View chi tiết
  getOneUser(id)
  {
    this.userService.getID(id).subscribe(data => {
      this.oneUser = data;
    }, error => {
      console.log(error);
    })
    console.log('user: ',id);
  }

  // delete user
  delUser(id){
    this.userService.deleteUser(id).subscribe(data => {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Xóa người dùng thành công.',
        showConfirmButton: false,
        timer: 1500
      });
      this.onSearch(true);
    }, error => {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Xóa người dùng thất bại.',
        showConfirmButton: false,
        timer: 1500
      });
      console.log(error);
    })
  }

  
  deleteUser(id,nameUser){
    Swal.fire({
      title:'Xóa người dùng',
      text: `Bạn có chắc chắn muốn xóa người dùng ${nameUser} không!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Đồng ý!'

    }).then(result => {
      if (result.value) {
        this.delUser(id);

      }
    });
  }

  // Lock - unlock user
  
  getIdUser(id)
  {
    this.userService.getID(id).subscribe(data => {
      this.listUsers = data;
      console.log('list: ',this.listUsers)
    }, error => {
      console.log(error);
    })

  }

  lockUser(id)
  {
    this.userService.lockUser(id).subscribe(data => {
    //  Swal.fire('Khóa!','Bạn vừa khóa thành công.','success');
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Bạn vừa khóa thành công.',
        showConfirmButton: false,
        timer: 1500
      });
      this.onSearch(true);
    }, error => {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Khóa người dùng thất bại.',
        showConfirmButton: false,
        timer: 1500
      });
    //  Swal.fire('Khóa người dùng!', 'Khóa người dùng thất bại.','warning');
      console.log(error);
    })
  }

  unlockUser(id){
    this.userService.unlockUser(id).subscribe(data => {
    //  Swal.fire('Mở khóa!', 'Bạn vừa mở khóa thành công.','success');
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Bạn vừa mở khóa thành công.',
        showConfirmButton: false,
        timer: 1500
      });
      
      this.onSearch(true);
    }, err => {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Mở khóa người dùng thất bại.',
        showConfirmButton: false,
        timer: 1500
      });
      console.log(err);

    })
  }

  unlockOneUser(id){
    Swal.fire({
      title:'Mở khóa người dùng',
      text: 'Bạn có chắc chắn muốn mở khóa người dùng này không!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Đồng ý!'

    }).then(result => {
      if (result.value) {
        this.unlockUser(id);

      }
    });
  }

  lockOneUser(id){
    Swal.fire({
      title: 'Khóa người dùng',
      text: 'Bạn có chắc chắn muốn khóa người dùng này không!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText:  'Đồng ý',

    }).then(result => {
      if (result.value) {
        this.lockUser(id);

      }
    });
  }

  // Set Status radio and validate status
  message: boolean = false;
  get form(){
    return this.formData.controls
  };

  handleRadioClick(value: string){
    if(this.formData.value.status === value){
      if(this.formData.value.noStatus){
        this.formData.patchValue({
          status: null,
          noStatus: this.formData.value.noStatus
        })
      }else{
        this.formData.patchValue({
          status: null,
          noStatus: null
        })
      }
    }else{
      this.formData.patchValue({
        status: value,
        noStatus: this.formData.value.noStatus
      })
    }

    if(!this.formData.value.status && !this.formData.value.noStatus){
      this.message = true
    }else{
      this.message = false
    }
  }

  handleRadioNoStatusClick(value: string){
    if(this.formData.value.noStatus === value){
      if(this.formData.value.status){
        this.formData.patchValue({
          status: this.formData.value.status,
          noStatus: null
        })
      }else{
        this.formData.patchValue({
          status: null,
          noStatus: null
        })
      }
    }else{
      this.formData.patchValue({
        status: this.formData.value.status,
        noStatus: value
      })
    }

    if(!this.formData.value.status && !this.formData.value.noStatus){
      this.message = true
    }else{
      this.message = false
    }
  }

  // update trực tiếp trên bảng
  idRowEdit:any;
  editRow: any;
  listUserCopy: any;
  listInvoiceTemplate$ = new Observable<any[]>();

  onEditRow(type, item){
    if(this.idRowEdit){
      this.listUsers = this.listUsers.map(e => (e.id === this.editRow.id? this.editRow :e));
    }
    this.editRow = JSON.parse(JSON.stringify(item));
    this.idRowEdit = item.id
  }

  onResetEditRow(item){
    const oldRowData = JSON.parse(this.listUserCopy).find(e =>e.id === item.id);
    this.listUsers = this.listUsers.map(e => e.id === oldRowData.id ? oldRowData : e);
  }

  onCancelEditRow(item){
    this.idRowEdit = null;
    this.listUsers = this.listUsers.map(e => e.id === this.editRow.id ? this.editRow: e);
  }

  onUpdateEditRow(item){
    const setData = omit(item, ['id']);
    const request = {
      fullName : setData.fullName,
      username : setData.username,
      email: setData.email,
      phone: setData.phone,
      active: setData.active
    };
    console.log("request", request);
    this.idRowEdit = null;
  }


  //Autocomplete------------------

  debouncerInvoice: Subject<string> = new Subject<string>();
  listInvoice$ = new Observable<any[]>();
  isSearchInvoice: boolean;
  listInvoiceName: any[];

  debounceOnSearch(){
    this.debouncerInvoice.pipe(debounceTime(TIME_OUT.DUE_TIME_SEARCH)).subscribe(value => this.loadDataOnSearchInvoice(value));
  }
  
  loadDataOnSearchInvoice(term){
    this.userService.getInvoiceTemplate({
      tenantBranchId: 'tenant',
      invoiceName: term,
      taxtCodeCluster: 'code'
    }).subscribe((res: HttpResponse<any[]>) =>{
      if(res && res.body['code'] === STATUS_CODE.SUCCESS){
        this.listInvoice$ = of(res.body['data'].map(e =>{
          e.tenantName = `${e.templateCode} - ${e.invoiceName}`;
          return e
        }).sort((a, b) => a.tenantName.localeCompare(b.tenantName))
        );
      }else{
        this.listInvoice$ = of([])
      }
    })
  }

  onSearchTemplate(event){
    const term = event.term;
    console.log("tẻm", term);
    
    if( term.trim() !== '' && this.listInvoice$.subscribe(res =>{
      return res.length === 0
    })){
      this.isSearchInvoice = true;
    }else{
      this.isSearchInvoice = false;
    }
    if(term !== ''){
      this.debouncerInvoice.next(term.trim())
    }
  }

  loadTemplatesInvoice(event){
    console.log("event", event);
    
    if(event){
      const supplierTaxCode = event.taxCode;
      if(supplierTaxCode !==  null){
        this.getInvoiceNameTemplate(supplierTaxCode);
      }else{
        this.listInvoiceName = [];
      }
    }else{
      console.log("?");
      
    }
  }
  
  getInvoiceNameTemplate(supplierTaxCode){
    this.userService.getBranchByTenant(supplierTaxCode).subscribe((res: HttpResponse<any>) =>{
      if(res && res.status === STATUS_CODE.SUCCESS){
        this.listInvoiceName = res.body;
        this.listInvoiceTemplate$ = of(this.listInvoiceName);
      }else{
        this.listInvoiceName = [];
      }
    })
  }


  // Bảng động

  listData = {
    headers:[
      {columnName:'ID', columnType:'INTEGER', notNull: true,primaryKey: false},
      {columnName:'name', columnType:'VARCHAR', notNull: true,primaryKey: false},
      {columnName:'code', columnType:'VARCHAR', notNull: true,primaryKey: false},
      {columnName:'fullName', columnType:'MEDIUMBLOB', notNull: true,primaryKey: false},
      {columnName:'email', columnType:'VARCHAR', notNull: true,primaryKey: false},
      {columnName:'dateStart', columnType:'TIMESTAMP', notNull: true,primaryKey: false}
    ],
    body:[
      {
        ID: 1,
        name:'admin',
        code:'AD',
        fullName: 'Admin sso',
        email:'abc@gmail.com',
        dateStart: '03-04-2020 03:05:40'
      },
      {
        ID: 2,
        name:'user',
        code:'USER',
        fullName: 'user sso',
        email:'user@gmail.com',
        dateStart: '08-02-2023 05:06:02'
      }
    ]
  }

  headerNoID: any = this.listData.headers.filter( e => e.columnName !== 'ID');
  IDColumn: any = this.listData.headers.filter( e => e.columnName === 'ID');
  contentList:any = this.listData.body;
  
  convertValueCol(columnType, value){
    return columnType.includes('DATE') || columnType.includes('TIME') ? this.formatDate(value) : value;
  }

  formatDate(date){
    return date ? moment (new Date(date)).format('YYYY-MM-DD HH:mm:ss') : null
  }

  returnTypeInput(type){
    if(type.includes('INT') || type.includes('DECIMAL')){
      return 'number'
    }else return 'text'
  }

  onEditTable(type, item){
    if(this.idRowEdit){
      this.listUsers = this.contentList.map(e => (e.ID === this.editRow.ID? this.editRow :e));
    }
    this.editRow = JSON.parse(JSON.stringify(item));
    this.idRowEdit = item.ID
  }

  onInputNumber(event:any, type: string, index: number, columnName: string){
    if(this.returnTypeInput(type) === 'number'){
      const minMaxObj = this.returnMaxMinField(type)
      const  min = minMaxObj.min;
      const max = minMaxObj.max;
      if(min && event.target.value < min ){
        event.target.value = min;
        this.contentList[index][columnName] = min;
      }
      if(max && event.target.value > max ){
        event.target.value = max;
        this.contentList[index][columnName] = max;
      }
    }
  }

  returnMaxMinField(type){
    if(type.includes('INT')){
      switch (type.split('(')[0]){
        case 'INT':
          return {max: 127, min: -138};
        case 'INTEGER':
          return {max:2147483647, min: -2147483647
          }
      }
    }else return { max: '', min:''}
  }

}

