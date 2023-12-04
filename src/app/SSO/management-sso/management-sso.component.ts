import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

// Ckeditor-----
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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
  listRoleCache: any = [];
  idApp: number;
  formControls: FormGroup
  valueForm;
  files: any;
  maxDate: any;
  errorDate: any = '';
  minDate: any = '';
  action: any = 'add';
  
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
  //  this.buildForm();
    const current = new Date();
    this.maxDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate() - 1
    }
    this.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    }

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
    this.listRole = [
      {role: 1928392328, roleCode: 'USER', status:0, description: 1, id:1},
      {role: 1928392328, roleCode: 'admin', status:1, description: 2, id:2},
      {role: 1928392329, roleCode: 'sso', status:1, description: 3, id:3}
    ];

    this.listRoleCache = this.listRole;
    this.formData = this.fb.group({
      roleId: '',
      appId: '',
     // Validators.pattern(/^[a-zA-Z0-9_]+$/)
      role: [null, Validators.compose([Validators.required, Validators.maxLength(50), Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")])],
      roleCode: [null, [Validators.required]],
      status: [null, [Validators.required]],
      description: [null],
      systemParamId: [null],
      startDate: [null, [Validators.required, this.validateStartDate.bind(this)]],
      receiveDate: [null, [Validators.required, this.validateEndDate.bind(this)]],
      endDate: [null, [Validators.required]],
      content: [null, [Validators.required]],
      isNew: false
    })
  }


  buildForm(){
    this.formData = this.fb.group({
      roleId: '',
      appId: '',
     // Validators.pattern(/^[a-zA-Z0-9_]+$/)
      role: [null, Validators.compose([Validators.required, Validators.maxLength(50), Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")])],
      roleCode: ['', [Validators.required]],
      status: [null, [Validators.required]],
      description: [null],
      systemParamId: [null],
      startDate: [null, [Validators.required, this.validateStartDate.bind(this)]],
      receiveDate: [null, [Validators.required, this.validateEndDate.bind(this)]],
      endDate: [null,],
      content: null,
      isNew: false
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
    // this.formData.value.roleCode = '';
    // this.formData.value.description = '';
    this.formData.patchValue({
      role: [null],
      roleCode: [null],
      status: [null],
      description: [null],
      systemParamId: [null],
      startDate: [null],
      endDate: [null,],
      content: null,
    })
  }

  onSubmit() {
    const value = this.formData.getRawValue();
    value.startDate = value.startDate ? moment(value.startDate).format('YYYY-MM-DD'): null
    console.log("formatDate---value", value);


    if (this.formData.invalid) {
      this.formData.markAllAsTouched();
      return
    }
    this.formData.value.appId = this.id;

    // let ngbDate = this.formData.controls['time'].value;
    // let myDate = new Date(ngbDate.year, ngbDate.month-1, ngbDate.day);
    // let formValues = this.formData.value;
    // formValues['time'] = myDate;
        
   // const formatDate = moment(myDate, 'YYYY-MM-DDTHH:mm:ss').format('DD/MM/yyyy HH:mm')

    const data = this.formData.getRawValue();
    if(this.action === 'edit'){
      const dataOld = this.listRole.filter( e => e.roleCode !== data.roleCode);
      this.listRole = [{...data, isNew : true}, ...dataOld];
      this.action = 'add'

    }else{
      const  filterRoleCode = this.listRole.find(e => e.roleCode ===  data.roleCode);
      if(filterRoleCode){
        alert("Mã quyền đã tồn tại")
      }else{
        const body = {
          ...data,
          isNew: true
        }
        this.listRole.push(body);
      }
    }
    this.onReset()
  }

  openEditRole(index) {
    this.formData.patchValue(this.listRole[index]);
    this.action = 'edit';
  }

  removeAt(index) {
    this.listRole.splice(index, 1);
  }

  getParamRole() {
    this.roleService.getAllParamID().subscribe(data => {
      this.selectParamId = data.data;
    }, error => {
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

    const tbody = this.listRole.filter(e => e.isNew === true);
    this.roleService.editRole(tbody).subscribe(data => {
      this.success();
      this.router.navigate(['/group-role/' + this.id]);

    }, error => {
      this.router.navigate(['/group-role/' + this.id]);
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

  //Datepicker------
  // Validate start date- end date
  validateStartDate(control: AbstractControl){
    if(!control || !control.value || !control.parent || !control.parent.get('receiveDate')){
      return null
    } 
    const receiveDate = control.parent.get('receiveDate');
    if(!receiveDate.value){
      return null
    }

    const boolCheck = moment(control.value).isAfter(moment(receiveDate.value), 'days');
    if(boolCheck){
      return {overReceiveDate: true}
    }
    return null
  }


  validateEndDate(control: AbstractControl){
    if(!control || !control.value || !control.parent || !control.parent.get('startDate')){
      return null
    }
    // Ngày kết thúc phai lớn hơn ngày bắt đầu
    const startDate = control.parent.get('startDate');
    if(!startDate.value){
      return null
    }
    const boolCheck = moment(control.value).isBefore(moment(startDate.value), 'days');
    if(boolCheck){
      startDate.setErrors({overReceiveDate : true});
      startDate.markAllAsTouched();
      startDate.markAsDirty();
      return null
    }else{
      startDate.setErrors(null);
      if(startDate.invalid){
        startDate.setErrors({required: true})
      }
    }
    return null
  }

  // CKeditor------
  editor = ClassicEditor;
  lengthCkeditor:number = 0;
  isView: any;

  configCkEdit:any = {
    placeholder: 'Nội dung',
    toolbar: [
      //'fontfamily',
      //'fontsize',
      //'alignment',
      'alignment',
      'bold',
      'italic',
      'underline',
      'bulletedList',
      'numberedList',
      '|',
      'link'
    ]
  }

  onChangeCkEditor({ editor }: ChangeEvent){
    let  data:any = editor.getData();
    data = data.split('<p>&nbsp;</p>').join('');
    this.lengthCkeditor = data.length;
    console.log("data---ceditor", data);  
  }

//  body.content = body.content?.split('<p>&nbsp;</p>').join('');

}
