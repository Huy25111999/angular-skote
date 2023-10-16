import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '../service/role.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

//import { ModalRoleComponent } from '../modal-role/modal-role.component';
import { ModalDismissReasons, NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { EditRoleComponent } from '../edit-role/edit-role.component';
import { ActivatedRoute, Router } from '@angular/router';
import * as FileSaver from "file-saver";
import { sampleData } from './datasource';
import { ImportFileComponent } from 'src/app/shared/components/import-file/import-file.component';
import * as moment from 'moment';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NgbDate, NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-management-sso',
  templateUrl: './management-sso.component.html',
  styleUrls: ['./management-sso.component.scss']
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
    private ngbDateParserFormatter: NgbDateParserFormatter
  ) {
    this.id = this.route.snapshot.params['id'];

    this.valueForm = [
      { name: 'admmin', phoneNumber: '249832' },
      { name: 'admmin1', phoneNumber: '2498329385' },
      { name: 'admmin2', phoneNumber: '249832487584' }]
  }

  public data: Object[];
  title='gettingstarted';
  formData: FormGroup;

  ngOnInit(): void {
    //this.onSearch(false);
    this.buildForm();
    this.selectStatus = [
      {id:1, name:'Kích hoạt', active: true},
      {id:0, name:'Không kích hoạt'},
      this.data = sampleData
    ];
    this.selected = '';
    this.hidden = true;

    this.getParamRole();

    this.formControls = this.fb.group({
      phone: this.fb.array([]),
      avatar: ''
    });
    this.patchFormArray();
    console.log("---------", this.formData);
    
  }


  buildForm(){
    this.formData = this.fb.group({
      roleId: '',
      appId: '',
     // Validators.pattern(/^[a-zA-Z0-9_]+$/)
      role: ['', Validators.compose([Validators.required, Validators.maxLength(50), Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")])],
      roleCode: ['', [Validators.required]],
      status: ['', [Validators.required]],
      description: [''],
      systemParamId: [''],
      time: ''
    })
  }

  get f(){
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

    let ngbDate = this.formData.controls['time'].value;
    //let myDate = this.ngbDateParserFormatter.format(ngbDate);

    let myDate = new Date(ngbDate.year, ngbDate.month-1, ngbDate.day);
    let formValues = this.formData.value;
    formValues['time'] = myDate;
    
    const formatDate = moment(myDate, 'YYYY-MM-DDTHH:mm:ss').format('DD/MM/yyyy HH:mm')
    console.log("formatDate", formatDate);
    console.log("this.formData.value", this.formData.value);
    

    this.listRole.push(this.formData.value);
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
  handleDate(event){
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

  // -----------------------------------Export new

  isLoading = false;
  destroy$ = new Subject<void>();
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  exportFile() {
    // if(this.formData.invalid){
    //   this.formData.markAllAsTouched();
    //   return;
    // }
    const data = this.formData.value;
    const request = {
        startDate: "2023-10-02T07:28:40.237Z",
        endDate: "2023-10-05T07:28:43.194Z",
        sku: null,
        typeMap: [
            "VTMAP"
        ]

      //...data,
      //startDate: moment(data.startDate, 'YYYY-MM-DDTHH:mm:ss').format(DATE_FORMAT_VI.DATE_HM_MOMENT),
      //endDate: moment(data.startDate, 'YYYY-MM-DDTHH:mm:ss').format(DATE_FORMAT_VI.DATE_HM_MOMENT)
    }
    this.isLoading = true;
    this.roleService.exportTraffic(request).pipe(
      finalize(() => this.isLoading = false),
      takeUntil(this.destroy$)
    ).subscribe(this.observer)
  }

  observer = {
    next: (res: any) => {
      this.isLoading = false;
      const dataForm = this.form.value;
      if (res) {
        const startDate = moment(dataForm.startDate, 'YYYY-MM-DDTHH:mm:ss').format('DDMMyyyy');
        const endDate = moment(dataForm.endDate, 'YYYY-MM-DDTHH:mm:ss').format('DDMMyyyy');
        const setName = 'Thông tin lưu lượng' + '_' + startDate + '_' + endDate ;
        const data = new Blob([res.body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
       // const data = new Blob([res.body], { type: 'text/plain' });

        FileSaver.saveAs(data, setName);
      } else {
        alert('error exporting data');
      }
    },
    error: async (e: Error) => {
      const message = await this.convertBlobToJson(e);
      alert('error')
    },
  }

  async convertBlobToJson(e: any) {
    return JSON.parse(await e.error.text()).message;
  }



  //---------Import
  import(){
    const modalRef = this.modalService.open(ImportFileComponent, { size : 'lg'})
      modalRef.componentInstance.dialogData = 'sso' ;
      modalRef.result.then((data)=>{
        console.log("data--", data);
        
      },(reason)=>{
        console.log("reason", reason);
        
      })
  }

  // form array
  get form(): FormArray {
    return this.formControls.get('phone') as FormArray;
  }
  phone(){
    return this.fb.group({
      name: '',
      phoneNumber: '',
      files: undefined
    })
  }
  addPhone(){
    this.form.push(this.phone())
  }
  removePhone(i: number){
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

  onChangeBase64(e,i){
    e.preventDefault();

    let file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

    let pattern = /image-*/;
    let reader = new FileReader();

    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    
    reader.onload = this._handleReaderLoaded.bind(this,i);
    reader.readAsDataURL(file);

  }
  _handleReaderLoaded(index, e) {
    let i = 0;
    for (let item of this.form.controls) {
      let control = <FormArray>this.formControls.controls['phone'];
      control.controls[index].get('files').setValue(e.target.result);
      i++;
    }
  }

  onCreatRole() {
    this.formControls.get('avatar').setValue(this.files);
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


  // image --------
  uploadFileImage(event){
    this.files = event;
    console.log("this.files", this.files);
    
  }

  // Arount time---- time --------
  hoveredDate: NgbDate;
  fromNGDate: NgbDate;
  toNGDate: NgbDate;
  hidden: boolean;
  selected: any;
  time: any;

  @Input() fromDate: Date;
  @Input() toDate: Date;
  @Output() dateRangeSelected: EventEmitter<{}> = new EventEmitter();

  isRange(date: NgbDate) {
    return date.equals(this.fromNGDate) || date.equals(this.toNGDate) || this.isInside(date) || this.isHovered(date);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromNGDate) && date.before(this.toNGDate);
  }

  isHovered(date: NgbDate) {
    return this.fromNGDate && !this.toNGDate && this.hoveredDate && date.after(this.fromNGDate) && date.before(this.hoveredDate);
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromNGDate = date;
      this.fromDate = new Date(date.year, date.month - 1, date.day);
      this.selected = '';
    } else if (this.fromDate && !this.toDate && date.after(this.fromNGDate)) {
      this.toNGDate = date;
      this.toDate = new Date(date.year, date.month - 1, date.day);
      this.hidden = true;
      this.selected = this.fromDate.toLocaleDateString() + '-' + this.toDate.toLocaleDateString();
      this.dateRangeSelected.emit({ fromDate: this.fromDate, toDate: this.toDate });

      this.fromDate = null;
      this.toDate = null;
      this.fromNGDate = null;
      this.toNGDate = null;

    } else {
      this.fromNGDate = date;
      this.fromDate = new Date(date.year, date.month - 1, date.day);
      this.selected = '';
    }
    console.log("selectedselectedselectedselected", this.selected);
    
  }

    // Note : Một số phương thức của form
    methodForm(){
      this.formData.addControl('tenant', new FormControl(null, [Validators.required]));
      this.formData.removeControl('tenant');
      this.formData.get('tenant').clearValidators();
      this.formData.get('tenant').updateValueAndValidity();
      this.formData.get('tenant').setValue(null)
    };
    
  // Validate form ---------------
  displayFieldHasError( field: string){
    return {
      'has-error': this.isFieldValid(field)
    }
  }

  isFieldValid(field: string){
     //return !this.formData.get(field).valid && this.formData.get(field).touched;
    const valid = !this.formData.controls[field].valid && (this.formData.controls[field].dirty || this.formData.controls[field].touched);
    return valid
  }

  getValueOfField(field){
    return this.formData.get(field).value
  }

}
