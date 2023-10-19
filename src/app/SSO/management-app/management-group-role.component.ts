import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RoleService } from '../service/role.service';
import { GroupRoleService } from '../service/group-role.service';
import { ModalRoleComponent } from '../role/modal-role/modal-role.component';
import { EditRoleComponent } from '../role/edit-role/edit-role.component';
import { AddGroupRoleComponent } from '../group-role/add-group-role/add-group-role.component';
import { domain } from 'src/app/model/domain';
import { UserService } from '../service/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EditGroupRoleComponent } from '../group-role/edit-group-role/edit-group-role.component';
import { role } from 'src/app/model/role';
import Swal from 'sweetalert2';
import { app } from 'src/app/model/app';
import { AddDomainComponent } from '../managementDomain/add-domain/add-domain.component';
import { EditDomainComponent } from '../managementDomain/edit-domain/edit-domain.component';
import { ConnectUserRoleComponent } from '../connect-user-role/connect-user-role.component';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, takeUntil } from 'rxjs/operators';
import { DestroyService } from '../service/destroy.service';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-management-group-role',
  templateUrl: './management-group-role.component.html',
  styleUrls: ['./management-group-role.component.scss'],
  providers: [DestroyService]
})
export class ManagementAppComponent implements OnInit {
  
  page: number = 1;
  pageSize = 10;
  count: number = 0;
  tableSize: number = 3;
  tableSizes: any = [3, 6, 9, 12];
  historySearch: any;
  totalElements:number;
  listRole: any = [];
  listGroupRoleUpdate = [];
  oneGroupRole=[];
  loading: boolean = false;

  oneRole=[];
  listRoleUpdate = [];
  listGroupRole: any= [];
  listDomain :any= [];
  idApp: number ; 

 // listApp: app[] = [];
  isRoll:any= true;
  isGroupRoll:any= true;
  listApp = [];
  
  members: any[] = [
      {
        id: 41,
        first_name: "Joan",
        last_name: "Brown",
        user_name: "jbrown",
        country: "Canada",
        age: 25
    },
    {
       id: 40,
        first_name: "Mort",
        last_name: "Johnston",
        user_name: "morty",
        country: "Canada",
        age:41
    },
    {
        id: 42,
        first_name: "Sally",
        last_name: "Johns",
        user_name: "smothers",
        country: "Canada",
        age:24
    },
    {
        id: 39,
        first_name: "Kat",
        last_name: "Preston",
        user_name: "kipreston",
        country: "United States",
        age:52
    },
    {
        id: 34,
        first_name: "James",
        last_name: "Preston",
        user_name: "jpreston",
        country: "United States",
        age:50
    },
    {
        id: 43,
        first_name: "Anya",
        last_name: "Promaski",
        user_name: "anyapro",
        country: "United States",
        age:43
    },
    {
        id: 44,
        first_name: "Elena",
        last_name: "Savkin",
        user_name: "esavkin",
        country: "United States",
        age:12
    },
    {
        id: 45,
        first_name: "Johan",
        last_name: "Severson",
        user_name: "jsever",
        country: "United States",
        age:32
    },
    {
        id: 46,
        first_name: "Kathya",
        last_name: "Smith",
        user_name: "ksmith",
        country: "United States",
        age:34
    },
    {
        id: 47,
        first_name: "Bill",
        last_name: "Lewis",
        user_name: "blewis",
        country: "United States",
        age:54
    },
    {
      id: 48,
      first_name: "Bill11",
      last_name: "Lewis11",
      user_name: "blewis11",
      country: "Viet Nam",
      age:10
  }
    ];

  constructor(
    private modalService : NgbModal,
    private roleService: RoleService,
    private userService: UserService,
    private groupRoleService: GroupRoleService,
    private fb: FormBuilder,
    private router:Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService
  ) { }

  ngOnInit(): void {
   // this.onSearchRole(false);
     this.searchApp(false);
     this.getProvinces();
     this.isProvinceSearch();
     this.getDistrict();
     this.isDistrictSearch();
  }

  formData:FormGroup = this.fb.group({
    app: '',
    pageNumber: this.page ,
    pageSize: this.pageSize,
    provinceCode: null,
    districtCode: null,
  })

  
  convertDateTime(date)
  {
    // let now =moment(date); 
    // return now.format("YYYY/MM/DD hh:mm:ss");
    let utcDate =moment.utc(date);
    let localDate = moment(utcDate).local();
    return localDate.format("YYYY/MM/DD HH:mm:ss");
  }
  //--------- App
  searchApp(flag?:boolean)
  {
    // const body = {app: " ", pageNumber: this.page, pageSize: this.pageSize}
    this.loading = true;
    let data: any;
    if(!flag){
      data = this.formData.value;
      this.historySearch = data;
      this.page = 1;
      this.pageSize= 10;
    }else{
      data = this.historySearch;
    }
    //C1
    // const page = this.page -1;
    // const size = this.pageSize
    // this.groupRoleService.search(data,page,size).subscribe(res =>{})
    //C2
    this.formData.value.pageNumber = this.page - 1;
    this.formData.value.pageSize = this.pageSize;
    console.log(this.formData.value);

    this.groupRoleService.getAllApp( this.formData.value).subscribe(data => {
      this.loading = false;
      if(data && data.data){
        if(data.data.content && data.data.content.length){
          this.listDomain = data.data.content;
        }else{
          this.listDomain = []
        }
        this.totalElements = data.data.totalElements || 0;
        this.cdr.detectChanges();
        this.refreshCheckedStatus();
      }else{ 
        this.listDomain = [];
        this.totalElements = 0;
      }
     
    }, error => {
      console.log(error);
      this.listDomain = [];
      this.totalElements = 0;
      this.loading = false;
     // this.router.navigate(['/account/login']);
    })
  }

  onPageChangeApp(event: any) {
    this.page = event;
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
    modalRef.result.then((data)=>{
      this.listDomain;
    })
  }


  openEditApp(data)
  {
    const modalRef = this.modalService.open(EditDomainComponent,{ size : 'lg'})
    modalRef.componentInstance.dtApp = data;
    modalRef.result.then( data=>{

    },reason =>{
      data = reason;
      this.listDomain;
      
    })
  }

  
  creatApp()
  {
    this.router.navigate(['/create-app']);
  }

  // delete app
  delete(id){
    this.groupRoleService.deleteApp(id).subscribe(data => {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Xóa app thành công.',
        showConfirmButton: false,
        timer: 1500
      });
      this.searchApp(true);
    }, error => {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Xóa app thất bại.',
        showConfirmButton: false,
        timer: 1500
      });
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
        this.delete(id);

      }
    });
  }

  lockDomain(id)
  {
    this.userService.lockDomain(id).subscribe(data => {
    //  Swal.fire('Khóa!','Bạn vừa khóa thành công.','success');
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Bạn vừa khóa thành công.',
        showConfirmButton: false,
        timer: 1500
      });
      this.searchApp(true);

    }, error => {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Khóa app thất bại!',
        showConfirmButton: false,
        timer: 1500
      });
      console.log(error);
    })
  }

  lockOneDomain(id){
    Swal.fire({
      title: 'Khóa app',
      text: 'Bạn có chắc chắn muốn khóa app này không!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText:  'Đồng ý',
      
    }).then(result => {
      if (result.value) {
        this.lockDomain(id);
      }
    });
  }

  unlockDomain(id){
    this.userService.unlockDomain(id).subscribe(data => {
     // Swal.fire('Mở khóa!', 'Bạn vừa mở khóa thành công.','success');
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Bạn vừa mở khóa thành công.',
        showConfirmButton: false,
        timer: 1500
      });
      this.searchApp(true);

    }, err => {
      //Swal.fire('Mở khóa!','Mở khóa app thất bại!','success');
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Mở khóa app thất bại!',
        showConfirmButton: false,
        timer: 1500
      });
      console.log(err);      
    })
  }

  unlockOneDomain(id){
    Swal.fire({
      title:'Mở khóa',
      text: 'Bạn có chắc chắn muốn mở khóa app này không!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Đồng ý!'
      
    }).then(result => {
      if (result.value) {
        this.unlockDomain(id);
       
      }
    });
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



  // Checkbox
  setOfCheckedId = new Set<any>();
  itemRecord: any= [];
  checked = false;
  // Note: them refreshCheckedStatus() vao search

  onAllChecked(value:boolean): void{
    if(this.members){
      console.log("value", value);
      
      this.members.forEach( item => this.updateCheckedSet(item?.id, value));
      this.refreshCheckedStatus();
    }
  }
  onItemChecked(id: number, checked: boolean){
    this.updateCheckedSet(id, checked);
    console.log("id", id, "checked",checked);
    
    this.refreshCheckedStatus()
  }
  updateCheckedSet(id: number, checked: boolean){
    if(checked){
      this.setOfCheckedId.add(id);
      const getItemFromId = this.members.filter( e =>{
        return e.id == id
      });
      if(getItemFromId){
        this.itemRecord.push(getItemFromId[0]);
      }
    }else{
      this.setOfCheckedId.delete(id);
      const getItemFromId = this.members.filter( e =>{
        return e.id == id
      })
      if(getItemFromId){
        this.itemRecord.splice(getItemFromId,1);
      }
    }

//    const inputId: any = Array.from(this.setOfCheckedId)

  }
  refreshCheckedStatus(){
    this.checked = this.members.every(item => this.setOfCheckedId.has(item.id));
  }

  get getSelectRecord(): number{
    return Array.from(this.setOfCheckedId).length || 0
  }

  //Ân hiện cột
  columns = [
    {key:0, value: 'first_name', isShow:true},
    {key:1, value: 'last_name', isShow:true},
    {key:2, value: 'user_name', isShow:true},
    {key:3, value: 'country', isShow:true},
    {key:4, value: 'age', isShow:true}
  ]

  toggleColumns(col){
    col.isShow = !col.isShow;
  }

  // refreshCountries() {
  //   this.countries = COUNTRIES
  //     .map((country, i) => ({id: i + 1, ...country}))
  //     .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  // }


  // Sort local ------------------------
  directive: string = 'DESC';
  isColumn:string;

  sort(key: string, directive: string){
    this.isColumn = key;
    if(directive === 'DESC'){
      this.members.sort((a:any, b:any) => {
        if(a[key] < b[key]) {
          return -1;
        }
        if(a[key] > b[key]) {
          return 1;
        }
        return 0
      })
      this.directive = 'ASC';
    }else{
      this.members.sort((a:any, b:any) => {
        if(a[key] < b[key]) {
          return 1;
        }
        if(a[key] > b[key]) {
          return -1;
        }
        return 0
      })
      this.directive = 'DESC';
    }

  }

  // chọn tinh-quận-huyện------------------------\
  isLoading: boolean  = false;
  listProvinces:any[] = [];
  listProvincesClone: any[] = [];
  isProvinceSearch$ = new Subject<any>();

  listDistrict:any[] = [];
  listDistrictClone: any[] = [];
  isDistrictSearch$ = new Subject<any>();


  getProvinces(){
    this.isLoading = true;
    this.userService.getProvince().pipe(finalize(() => {
      this.isLoading = false;
    })).subscribe((res:any) =>{
      if(res){
        this.listProvinces = res.data;
        this.listProvincesClone = cloneDeep(this.listProvinces);
        console.log("listProvinces", this.listProvinces);
        
      }else{
        alert('Lỗi'+ res.message);
      }
    })
  }

  searchProvince(val:any){
    if(val.term){
      console.log("val", val.term);
      this.isProvinceSearch$.next(val.term);
    }
  }

  isProvinceSearch(){
    this.isProvinceSearch$.pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
     .subscribe((res:any) =>{
         if(res){
           this.listProvinces = this.listProvincesClone.filter( (e : any) =>{
             return e.name.toLowerCase().includes(res.toLowerCase().trim());
           });              
         }else{
           this.listProvinces = cloneDeep(this.listProvincesClone);
         }
     })
  }

  changeProvince(event: any){
    console.log("êvent--", event);
  }
//----
  getDistrict(){
    this.formData.get('provinceCode')?.valueChanges.subscribe(data =>{
      if(data){
        this.formData.get('districtCode')?.enable();
        this.formData.get('districtCode')?.setValue('');
        this.getDistrictById(data)
      }else{
        this.listDistrict = [];
        this.formData.get('districtCode')?.enable();
        this.formData.get('districtCode')?.setValue('');
      }
    });
  }

  getDistrictById(id: any){
    this.isLoading = true;
    this.userService.getDistrict(id).pipe(finalize(() => {
      this.isLoading = false;
    })).subscribe((res:any) =>{
      if(res){
        this.listDistrict = res.data;
        this.listDistrictClone = cloneDeep(this.listDistrict);        
      }else{
        alert('Lỗi'+ res.message);
      }
    })
  }

  searchDistrict(val:any){
    if(val.term){
      console.log("val", val.term);
      this.isDistrictSearch$.next(val.term);
    }
  }

  isDistrictSearch(){
    this.isDistrictSearch$.pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
     .subscribe((res:any) =>{
         if(res){
           this.listDistrict = this.listDistrictClone.filter( (e : any) =>{
             return e.name.toLowerCase().includes(res.toLowerCase().trim());
           });              
         }else{
           this.listDistrict = cloneDeep(this.listDistrictClone);
         }
     })
  }

  changeDistrict(event: any){
    console.log("êvent--", event);
  }

}


