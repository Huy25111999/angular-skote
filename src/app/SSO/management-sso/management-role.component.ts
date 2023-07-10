import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '../service/role.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

//import { ModalRoleComponent } from '../modal-role/modal-role.component';
import { ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { EditRoleComponent } from '../edit-role/edit-role.component';
import { ActivatedRoute, Router } from '@angular/router';
import * as FileSaver from "file-saver";
@Component({
  selector: 'app-management-role',
  templateUrl: './management-role.component.html',
  styleUrls: ['./management-role.component.scss']
})
export class ManagementSSOComponent implements OnInit {

  id: any;
  index: number = 0;
  page: number = 1;
  pageSize = 10;
  count: number = 0;
  tableSize: number = 3;
  tableSizes: any = [3, 6, 9, 12];
  totalElements: number;
  selectValue: any[];
  selectStatus: any[];
  selectParamId: any[];

  listRole: any = [];
  idApp: number;
  formControls: FormGroup
  valueForm;
  files: any;
  constructor(
    private roleService: RoleService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.id = this.route.snapshot.params['id'];
    this.formControls = this.fb.group({
      phone: this.fb.array([]),
      avatar: ''
    });
    this.valueForm = [
      { name: 'admmin', phoneNumber: '249832' },
      { name: 'admmin1', phoneNumber: '2498329385' },
      { name: 'admmin2', phoneNumber: '249832487584' }]
  }

  ngOnInit(): void {
    //this.onSearch(false);
    this.selectStatus = [
      { id: 1, name: 'Kích hoạt', active: true },
      { id: 0, name: 'Không kích hoạt' }
    ];

    this.getParamRole();

    this.patchFormArray()
  }

  formData: FormGroup = this.fb.group({
    roleId: '',
    appId: '',
    role: ['', [Validators.required]],
    roleCode: ['', [Validators.required]],
    status: ['', [Validators.required]],
    description: [''],
    systemParamId: [''],
    time: ''
  })

  get f() {
    return this.formData.controls;
  }

  //Search
  // onSearch(flag)
  // {
  //   console.log(this.formData.value);
  //   this.roleService.searchRole( {
  //     ...this.formData.value, page: this.page, pageSize: this.pageSize
  //   }).subscribe(data => {
  //     this.listRole = data.data.content;
  //     console.log('list doamin : ',data);
  //     this.totalElements = data.data.totalElements;
  //   }, error => {
  //     console.log(error);    

  //   })

  // }

  // onPageChange(event: any) {
  //   this.page = event;
  //   this.onSearch(true);
  // }

  // pageChangeEvent(event: any) {
  //   this.page = 1;
  //   this.pageSize = event;
  //   this.onSearch(true);
  // }

  // reset
  onReset() {
    this.formData.reset();
    this.formData.value.roleCode = '';
    this.formData.value.description = '';
  }

  onSubmit() {
    this.formData.value.appId = this.id;
    this.listRole.push(this.formData.value);
  }

  onCreatRole() {
    this.formControls.get('avatar').setValue(this.files);

    console.log("fomrArray", this.form.controls);
    let i = 0;
    for (let item of this.form.controls) {
      // let control = <FormArray>this.formControls.controls['phone'];
      // control.controls[i].get('filess').setValue('2893473924');
      // console.log("alue--", item);
      // item.get('filess').setValue(2893473924);

      i++;
    }
    console.log('value formArray', this.formControls.getRawValue());


    const tbody = this.listRole;
    this.roleService.editRole(tbody).subscribe(data => {
      console.log('list role', this.listRole);
      console.log('data', data.data);
      this.success();
      this.router.navigate(['/group-role/' + this.id]);

    }, error => {
      return error;
    })
  }

  openEditRole(index) {
    this.formData.patchValue(this.listRole[index]);
    console.log(index);
    console.log('data', this.listRole[index]);
  }

  removeAt(index) {
    this.listRole.splice(index, 1);
  }

  getParamRole() {
    this.roleService.getAllParamID().subscribe(data => {
      console.log("submit:", data);
      this.selectParamId = data.data;
    }, error => {
      console.log(error);
      return;
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

  //Open modal
  //  openModalAdd(data)
  // {
  //   const modalRef = this.modalService.open(ModalRoleComponent, { size : 'lg'})
  //   modalRef.componentInstance.listRole== data ;
  //   modalRef.result.then((data)=>{

  //   },(reason)=>{
  //     data = reason;
  //     this.onSearch(true) ;
  //   })
  // }

  // openModalEdit(data)
  // {
  //   const modalRef = this.modalService.open(EditRoleComponent, { size : 'lg'})
  //   modalRef.componentInstance.dtRole== data ;
  //   modalRef.result.then((data)=>{

  //   },(reason)=>{
  //     data = reason;
  //     this.onSearch(true) ;
  //   })
  // }

  handleDate(event) {
    console.log("-dfd---event", event);
  }

  // Download
  download() {
    const data = { name: '123', age: '343' };
    this.roleService.getList({ page: 0, size: 1000 }, { name: '123', age: '343' }).subscribe(res => {
      if (res && res.data && res.data.length) {
        const body = {
          workDTOList: res.data,
          fromDate: data.name,
          toDate: data.age
        };
        this.roleService.downloadExcel(body).subscribe(request => {
          // ---Cách 1------
          const data = new Blob([request], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const fileName = 'Danh sách quyền.xlsx';
          FileSaver.saveAs(data, fileName);
          //---Cách 2 -----
          if (request) {
            this.downloadFile(request);
            this.success();
          }
        });
      }
    }, error => {
      console.log("error saving", error);

    });
  }

  downloadFile(data) {
    if (!data) {
      console.log("Show error download");
      return
    }
    //const fileName = data.headers.get('File');
    const fileName = 'Danh sách quyền.xlsx';
    const link = document.createElement('a');
    const url = URL.createObjectURL(data.body);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  //---------Import 
  import() {

  }

  // form array
  get form(): FormArray {
    return this.formControls.get('phone') as FormArray;
  }
  phone() {
    return this.fb.group({
      name: '',
      phoneNumber: '',
      files: undefined
    })
  }
  addPhone() {
    this.form.push(this.phone())
  }
  removePhone(i: number) {
    this.form.removeAt(i);
  }

  patchFormArray() {
    let i = 0;
    for (let value of this.valueForm) {
      this.addPhone();
      let control = <FormArray>this.formControls.controls['phone'];
      control.controls[i].patchValue(value);
      i++;
    }

  }

  onChangeBase64(e) {
    e.preventDefault();

    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

    var pattern = /image-*/;
    var reader = new FileReader();

    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);

  }
  _handleReaderLoaded(e) {
    var reader = e.target;
    console.log(reader.result)
  }
  // image --------
  setValue(event) {
    this.files = event;
  }

}
