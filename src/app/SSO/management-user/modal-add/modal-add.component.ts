import { FilterModule } from 'ng2-smart-table/lib/components/filter/filter.module';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
      fullName:['',[Validators.required,Validators.maxLength(100)]],
      username:['',[Validators.required,Validators.maxLength(100)]],
      password:['',[Validators.required,Validators.minLength(6)]],
      // email:['',[Validators.required, Validators.email,  Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      // email:['',[Validators.required, Validators.email,  Validators.pattern(/^[a-zA-Z0-9][a-zA-Z0-9_\.]+@[a-zA-Z0-9]{1,}(\.[a-zA-Z0-9]{1,10}){1,2}$/)]],
      email:['',[Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.com?$')]],
      active:[1,Validators.required],
      phone:['',[Validators.required, Validators.maxLength(10),Validators.minLength(10), Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
    //  phone:['',[Validators.required, Validators.maxLength(10),Validators.minLength(10), Validators.pattern(/^([0-9]){10,10}$/)]],
      issueDate:[null,[Validators.required]],
      gender:null,
      position:[null,[Validators.required,Validators.maxLength(100)]],
      currentNumber:[null]
    })
   // Validators.pattern("^[0-9]*$"),
   
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
  }

  get f(){
    return this.formData.controls;
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
    console.log("data", data);
    
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
}
