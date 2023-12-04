import { FilterModule } from 'ng2-smart-table/lib/components/filter/filter.module';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { User } from 'src/app/core/models/auth.models';
import { infor } from 'src/app/model/infor';
import { UserService } from '../../service/user.service';
import { NgbModal,NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { GroupRoleService } from '../../service/group-role.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { DestroyService } from '../../service/destroy.service';
import {cloneDeep} from "lodash";
import {
  NgbCalendar,
  NgbDate,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDatepicker,
  NgbDatepickerI18n,
  NgbDateStruct,
  NgbDropdown,
} from '@ng-bootstrap/ng-bootstrap';
import { CustomDatepickerI18n, I18n } from 'src/app/shared/components/date-picker/datepicker-i18n';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/shared/components/date-picker/datepicker-adapter';
import * as moment from 'moment';
import { autoSlashDateTime } from 'src/app/shared/components/date-picker/date-picker.component';
  
export const REGEX_PASSWORD =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[`~\!@#\$%\^&\*\(\)_\-=\+\{\}\[\]\\\|;:'"\?\/><.,])[A-Za-z\d`~\!@#\$%\^&\*\(\)_\-=\+\{\}\[\]\\\|;:'"\?\/><.,]{0,}$/;

export const REGEX_PHONE = /^(0){1}(3|5|7|8|9)([0-9]{8})$/;

@Component({
  selector: 'app-modal-add',
  templateUrl: './modal-add.component.html',
  styleUrls: ['./modal-add.component.scss'],
  providers: [DestroyService,
    I18n,
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n},
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ]
})
export class ModalAddComponent implements OnInit {
  @Input() 
  listUsers : infor[]= [];
  edit:  infor[]= [];
  modalRef: any ;
  submitted = false;
  message: string ; 
  err: boolean = false;
  formData:FormGroup;
  appRole: FormGroup;
  idApp: number;
  idGroupRole: number;

  selectAppId: any[] ;
  selectGroupRole: any[];
  selectGroupRoleId: any [];
  selectStatus: any[];

  selectGender: any[]=[];
  selectGenderClone: any[] = [];
  isGenderSearch$ = new Subject<any>();

  name = '';

  @ViewChild('issueDate') issueDate: ElementRef;

  constructor( 
    private fb: FormBuilder,
    private userService: UserService,
    private groupRoleService: GroupRoleService,
    private modalService : NgbModal,
    public activeModal: NgbActiveModal,
    private route:Router,
    private destroy$: DestroyService,
    ) {
      this.appRole = this.fb.group({
        userAppDto: this.fb.array([]),
      });
    }

  ngOnInit(): void {

    this.selectStatus = [
      {id:1, name:'Kích hoạt', selected: true},
      {id:0, name:'Không kích hoạt'}
    ];
    
    this.selectGender = [
      {id:0, name:'Nữ'},
      {id:1, name:'Nam'}
    ];

    this.formData = this.fb.group({
      fullName:['',[Validators.required,Validators.maxLength(100),Validators.minLength(6)]],
      username:['',[Validators.required,Validators.maxLength(100)]],
      password:['',[Validators.required,this.minMaxLenghtValidator(6,10)]],
      // password:['',[Validators.required,Validators.minLength(6), Validators.pattern(REGEX_PASSWORD)]],
      // email:['',[Validators.required, Validators.email,  Validators.pattern(/^[a-zA-Z0-9][a-zA-Z0-9_\.]+@[a-zA-Z0-9]{1,}(\.[a-zA-Z0-9]{1,10}){1,2}$/)]],
      email:['',[Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.com?$')]],
      active:[1,Validators.required],
      //phone:['',[Validators.required, Validators.maxLength(10),Validators.minLength(10), Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      phone: ['', [ Validators.pattern(/^(\d{3}|(\(\d{3}\)))[-]?\d{3}[-]?(\d{4})$/)]],
      image: [null, Validators.required],
      price: ['0', [Validators.required, this.NumberOnly, this.maxLength15Validator]],
      issueDate:[null,[Validators.required]],
      gender:null,
      enable: null,
      position:[null,[Validators.required,Validators.maxLength(100)]],
      currentNumber:[null],
      // startDate: [null, [Validators.required, this.validateStartDate.bind(this)]],
      // receiveDate: [null, [Validators.required, this.validateEndDate.bind(this)]],
      startDate: [null, [Validators.required]],
      receiveDate: [null, [Validators.required]],
    },{ validator: this.dateRangeValidator() })

   // Validators.pattern("^[0-9]*$"),
    // Validators.pattern("/^[\d,]+$/g"),   --> only input number

    this.selectGenderClone = cloneDeep(this.selectGender);
    this.isGenderSearch();

    const current =  new Date();
    this.maxDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate() - 1
    };
    //this.formData.get('issueDate').setValue(new Date && this.toDate(new Date));
    this.onchangeDate();
    this.onChangePrice();
  }

  get f(){
    return this.formData.controls;
  }

  private minMaxLenghtValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value && control.value.length < min) {
        return { minMax: true };
      }
      const value = control.value;
      if (value && !REGEX_PASSWORD.test(value)) {
        return { checkPassWord: true };
      }
      return null;
    };
  }
  //Date
  maxDate: any;
  errorDate: any = '';

  onchangeDate(){
    this.formData.controls.issueDate?.valueChanges.subscribe((res: any) =>{
      const pattern = new RegExp(/^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4})$/);
      if(res){
        if(!pattern.test(res)){
          this.errorDate = "Ngày cấp định dạng DD/MM/YYYY";
        }else{
          this.errorDate = '';
          let now = new Date();
          now.setDate(now.getDate() - 1);
          let dateParts = res.split("/");
          if(dateParts.length === 1){
            dateParts = res.split("/");
          }
          if(parseInt(dateParts[1]) == 2){
            if(parseInt(dateParts[0]) >29){
              this.errorDate = "Ngày ko tồn tại";
              return
            }
          }else if(parseInt(dateParts[1]) == 4 || parseInt(dateParts[1]) == 6 || parseInt(dateParts[1]) == 8 || parseInt(dateParts[1]) == 11 || parseInt(dateParts[1]) == 9){
            if(parseInt(dateParts[0]) > 30){
              this.errorDate = 'Ngày ko tồn tại';
              return;
            }
          }else{
            if(parseInt(dateParts[0]) > 31){
              this.errorDate = 'Ngày ko tồn tại';
              return;
            }
          }

          const dateObject = new Date( +dateParts[2], dateParts[1] -1, +dateParts[0]);
          if(dateObject > now){
            this.errorDate = 'Ngày cấp phải nhỏ hơn ngày hiện tại'
          }else{
            this.errorDate = ''
          }
        }
      }else{
        this.errorDate = ''
      }
    
    })
  }

  formatDate(input){
    const datePart = input.match(/\d+/g);
    const year = datePart[2];
    const month = datePart[1];
    const day = datePart[0];
    return day + '/' + month + '/'+ year
  }

  toDate(input){
    const datePart = input.match(/\d+/g);
    const year = datePart[2];
    const month = datePart[1];
    const day = datePart[0];
    return day + '-' + month + '-'+ year
  }

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

  dateRangeValidator(): ValidatorFn {
    return (formGroup: FormGroup): { [key: string]: any } | null => {
      const startDate = formGroup.get('startDate').value;
      const endDate = formGroup.get('receiveDate').value;

      if (startDate && endDate && startDate > endDate) {
        return { dateRangeError: true };
      }

      return null;
    };
  }

  autoSlash(event: any) {
    const getValueTime = this.formData.get('startDate').value;
    event.target.value = autoSlashDateTime(event);
    
  }

  // Custom search selectGender

  searchGender(val: any) {
    if(val.term){
      this.isGenderSearch$.next(val.term);
    }
  }

  isGenderSearch(){
    this.isGenderSearch$.pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe( (res: any) =>{
      if(res){
        this.selectGender = this.selectGenderClone.filter((e: any) =>{
          return e.name.toLowerCase().includes(res.toLowerCase().trim());
        });        
      }else{
        this.selectGender = cloneDeep(this.selectGender);
      }
    })
  }

  onChange(item: any){
    console.log("item", item);
    
  }


  //custom select new
  countries = [
    { name: 'India', code: 'ind' },
    { name: 'United States', code: 'usa' },
    { name: 'Aruba', code: 'abw' },
    { name: 'United Arab Emirates', code: 'uae' },
  ];
  selectedSimpleItem = [];

  customSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item.code.toLocaleLowerCase().indexOf(term.trim()) > -1 ||
      item.name.toLocaleLowerCase().indexOf(term.trim()) > -1 ||
      item.name.toLocaleLowerCase().includes(term.toLocaleLowerCase().trim())
    );
  }

  
  // only input number
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
   
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  
  onSubmit()
  {
    const data = this.formData.getRawValue();    
    const resultForm = {
      ...data,
      image: this.imageDeviceBase64
    }
    console.log("data-----------", resultForm);
    
    if (this.formData.invalid) {
      this.formData.markAllAsTouched();
      return
    }
    if(this.errorDate){
      return
    }

     this.formData.value.active = parseInt(this.formData.value.active);
     this.formData.value.gender = parseInt(this.formData.value.gender);

    const body = {
      ...this.formData.value,
      image: this.imageDeviceBase64
     // issueDate: this.formData.value.issueDate ? this.formatDate(this.formData.value.issueDate): null
    }

    console.log("result body", body);
    

     this.userService.addUser(this.formData.value).subscribe(data => {
      this.activeModal.dismiss(this.formData.value);
      this.activeModal.close('Close click');  
      this.success();  
      
    }, error => {
      console.log(this.message);
      return ;
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

  // Dải số chỉ được nhập số và không nhập số 0 ở đằng trước
  onlyNumber(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if ((charCode > 31 && charCode < 43)  ||  (charCode > 43 && charCode < 48) || (charCode > 57)) {
      return false;
    }
    this.formData.controls.currentNumber.valueChanges.subscribe(item =>{
      if(item.length > 1){
        if(item && item.includes(0)){
          if(item.startsWith(0)){
            this.formData.patchValue({
              currentNumber: item.replace(0,'')
            })
          }
        }
      }
    })

    return true;
  }

  isNum(val: any) {
    return !isNaN(val);
  }


  // Note : Một số phương thức của form
  methodForm(){
    this.formData.addControl('tenant', new FormControl(null, [Validators.required]));
    this.formData.removeControl('tenant');
    this.formData.get('tenant').clearValidators();
    this.formData.get('tenant').updateValueAndValidity();
    this.formData.get('tenant').setValue(null)
  };

  displayFieldHasError( field: string){
    return {
      'has-error': this.isFieldValid(field)
    }
  }
  isFieldValid(field: string){
    return !this.formData.get(field).valid && this.formData.get(field).touched;
  }

  // Xử lý images
  imageDeviceBase64: any;
  titleImageDevice = '';

  onSelectedImageDevice(event: any) {
    if (event.target.files[0]) {
      this.titleImageDevice = event.target.files[0].name;
    } else {
      if (!this.imageDeviceBase64) {
        this.titleImageDevice = 'configpage.pick_image';
      }
    }
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageDeviceBase64 = reader.result;
        // this.imageDeviceBase64 = this.sanitizer.bypassSecurityTrustResourceUrl(reader.result as string);
        const stringJpeg = 'data:image/jpeg;base64,';
        const stringPng = 'data:image/png;base64,';
        this.imageDeviceBase64 = this.imageDeviceBase64.replace(stringJpeg, '');
        this.imageDeviceBase64 = this.imageDeviceBase64.replace(stringPng, '');
      };
      this.formData.get('image')?.removeValidators(Validators.required);
    }
  }

  // Xử lý giá tiền
  maxLength15Validator(c: AbstractControl) {

    let amount = c.value;
    if (amount == "") {
      amount = '0';
    }
    let val;
    if (amount?.includes(",")) {
      val = amount.split(',').join("");
    }
    return (`${val}`.length > 15) ? {
      maxLength: true
    } : null;
  }

  NumberOnly(c: AbstractControl): ValidationErrors | null {
    const value = c.value;
    const REGEX_NUMBER = /^[\d,]+$/g;
  
    if (value && !REGEX_NUMBER.test(value)) {
      return { numberOnly: true };
    }
  
    return null;
  }
  
  onChangePrice(){
    this.formData.get('price')?.valueChanges.subscribe(res => {
      if (!res || res.price === 0) {
          this.formData.patchValue({ price: 0 }, { emitEvent: false });
      } else {
          let formatPrice = this.handleChangeMoney(res);
          this.formData.patchValue({ price: formatPrice }, { emitEvent: false })
      }
    })
  }

  handleChangeMoney(val: any) {
    let value = val.replace(/[,]/g, '');
  
    if (Number(value.replace(/[,]/g, ''))) {
      const money = Number(val.replace(/[^0-9]+/g, ''));
      if (!money) {
        return '0';
      }
  
      const moneyStr = money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return moneyStr;
    } else {
      return val;
    }
  
    // const money = Number(val.replace(/[^0-9]+/g, ''));
    // if (!money) {
    //   return '0';
    // }
  
    // const moneyStr = money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    // return moneyStr;
  }
}
