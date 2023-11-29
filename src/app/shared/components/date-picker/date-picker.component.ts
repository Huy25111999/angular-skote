import {Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges, ChangeDetectionStrategy, ViewChild, Optional, Self} from '@angular/core';
import {Subject} from "rxjs";
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
import {CustomDateParserFormatter, CustomAdapter} from './datepicker-adapter';
import * as moment from "moment";
import {AbstractControl, FormBuilder, FormControl, NgControl} from '@angular/forms'
import {CustomDatepickerI18n, I18n} from "./datepicker-i18n";
import { debounceTime } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { NgbTime } from '@ng-bootstrap/ng-bootstrap/timepicker/ngb-time';
import { param } from 'jquery';

export function autoSlashDateTime(event: any): string {
  const inputValue = event.target.value.replace(/[\/\s:]/g, '');

  const regexDateTime = /^([1-9]|([012][0-9])|(3[01]))\/([0]{0,1}[1-9]|1[012])\/\d\d\d\d(\s(([01]{0,1}[0-9])|(2[0-3])):[0-5][0-9])?$/;
  const regexDay = /^([1-9]|([012][0-9])|(3[01]))\/?$/;
  const regexMounth = /^([0]{0,1}[1-9]|1[012])\/?$/;
  const regexYear = /^\d\d\d\d$/;
  const regexHour = /^(([01]{0,1}[0-9])|(2[0-3]))$/;
  const regexMinute = /^[0-5][0-9]$/;

  let day = inputValue.slice(0, 2);
  let mounth = inputValue.slice(2, 4);
  let year = inputValue.slice(4, 8);
  let hour = inputValue.slice(8, 10);
  let minute = inputValue.slice(10, 12);

  if (event.which == 8) {
    return  event.target.value;
  }

  let result = '';
  if (day && regexDay.test(day)) {
    if (day.length === 2) {
      result += (day + '/');
    } else {
      return result + day;
    }
  } else {
    return day.slice(0,2);
  }

  if (mounth && regexMounth.test(mounth)) {
    // if (mounth.length === 2) {
    //   result += (mounth + '/');
    // }
    // else if (mounth.length === 1 && mounth <= 9) {
    //   result += ('0' + mounth + '/');
    // }
    // else {
    //   return result + mounth;
    // }

    if (mounth.length === 2) {
      result += (mounth + '/');
    }
    else if ( mounth <= 9) {   
      result += ( mounth + '/');
    }
    else {
      return result + mounth;
    }
  } else {
    return result + mounth.slice(0, 2);
  }

  if (year && regexYear.test(year)) {
    if (year.length === 4) {
      result += (year + ' ');
    } else {
      return result + year;
    }
  } else {
    return result + year.slice(0, 4);
  }

  // if (hour) {
  //   if (parseInt(hour) >= 0 && parseInt(hour) <= 23) {
  //     if (hour.length === 2) {
  //       result += hour + ':';
  //     } else {
  //       result += hour;
  //     }
  //   } else {
  //     if (parseInt(hour) < 0) {
  //       result += '00:';
  //     } else {
  //       result += '23:';
  //     }
  //   }
  // }

  // if (minute) {
  //   if (parseInt(minute) >= 0 && parseInt(minute) <= 59) {
  //     if (minute.length === 2) {
  //       result += minute;
  //     } else if (parseInt(minute) == 0) {
  //       return result + minute;
  //     } else {
  //       result += (minute);
  //     }
  //   } else {
  //     if (parseInt(minute) < 0) {
  //       result += '00';
  //     } else {
  //       result += '59';
  //     }
  //   }
  // }

  return result;
}

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],  
  providers: [
    I18n,
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n},
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePickerComponent implements OnInit, OnChanges {

  
  model: any;
  @Output() date = new EventEmitter();
  @Input() control: AbstractControl
  @Input() placement: string;
  @Input() minDate: any = null;
  inputSubject = new Subject();
  valid = true;

  constructor(
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>
  ) {
    this.inputSubject.pipe().subscribe(value =>{
      const a: any = moment( value, 'DD/MM/YYYYTHH:mm:ss').toDate();
      if(a != 'Invalid Date'){
        this.control.setValue(a);
        this.valid = true;
      }else{
        if( !this.model || this.model === ''){
          this.valid = true;
        }else{                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
          this.valid = false;
        }
      }
    })
  }

  ngOnInit(): void {
    this.parseValue();
    this.control.valueChanges.subscribe(value =>{
      console.log("this.conyrkds", this.control);
      
      if( !value){
        this.model = null;
      }else{
        this.parseValue();
      }
    })
  }
  ngOnChanges(changes : SimpleChanges){
    this.parseValue();
  }
  format(event: any): void {
    console.log("this.conyrkd22s", this.control);

    //this.date.emit(this.model);
    this.inputSubject.next(event);
  }
  parseValue(){
    console.log("this.conyrkds", this.control);

    if(this.control.value){
      this.model = moment(this.control.value, 'DD/MM/YYYYTHH:mm:ss').format('DD/MM/YYYY');
    }
  }
  clear(){
    this.control.setValue(null);
    this.model = null
  }


  //Datepicker------
  autoSlash(event: any) {
    console.log("this.conyrkds", this.control);

    const getValueTime = this.control.value;
    console.log("getValueTime", getValueTime);
    
    console.log("event autoSlash", event);
    event.target.value = autoSlashDateTime(event);
    
  }


  
 //---------------------------------

//  @Input() minDate: Date;
//  @Input() maxDate: Date;
//  @Input() type: String;
//  @Input() dateInput: Date;
//  @Input() required: boolean;
//  @Input() placeholder: String;
//  @Input() isValid: boolean;
//  @Output() dateInputChange = new EventEmitter();
//  @Output() timeChange = new EventEmitter();

//  onChange;
//  onTouched;
//  readonly DELIMITER_DATE = '/';
//  readonly DELIMITER_TIME = ':';

//  @ViewChild(NgbDropdown, {static: true})
//  private dropdown: NgbDropdown;

//  @ViewChild('ngbDatepicker', {static: true})
//  private datePicker: NgbDatepicker;
//  formatDate: string;

//  formDatePicker = this.formBuilder.group({
//   datePicker: [],
//   timeValue: [],
//   dateValue: []
//  })

//  dateValue: any;
//  timeValue: any;
//  isShowTime = false;
//  today: Date;

//  regexDate: RegExp;
//  regexTime: RegExp;
//  regexDateTime: RegExp;
//  min: any;
//  max: any;
//  isOpen: boolean = false;

//   constructor(
//     private formBuilder: FormBuilder, 
//     @Self() @Optional() private controlDirective: NgControl,
//     private datePipe: DatePipe
//   ){

//   }

//   ngOnInit(): void {
//     this.isShowTime = false;
//     this.formatDate = 'dd/MM/yyyy';
//     if(this.type === 'datetime'){
//       this.isShowTime = true;
//       this.formatDate = 'dd/MM/yyyy HH:mm:ss';
//     }else{
//       this.type = 'date';
//     }

//     const strRegexDate = '/^\\d{2}' + this.DELIMITER_DATE + '\\d{2}' + this.DELIMITER_DATE + '\\d{4}$/'
//     this.regexDate = new RegExp(strRegexDate);
//     const strRegexTime = '/^\\d{2}' + this.DELIMITER_TIME + '\\d{2}' + this.DELIMITER_TIME + '\\d{2}$/'
//     this.regexTime = new RegExp(strRegexTime);
//     const strRegexDateTime = strRegexDate + strRegexTime;
//     this.regexDateTime = new RegExp(strRegexDateTime);

//     if(this.controlDirective){
//       if(this.controlDirective.control.value){
//         this.dateInput = this.convertDateTime(this.controlDirective.control.value);
//       }
//       this.controlDirective.control.setValidators([this.validate.bind(this)]);
//       this.controlDirective.control.updateValueAndValidity();
//     }

//     if(this.minDate){
//       this.min = {year: this.minDate.getFullYear(), month: this.minDate.getMonth() + 1, day: this.minDate.getDate()}; 
//     }
//     if(this.maxDate){
//       this.max = {year: this.maxDate.getFullYear(), month: this.maxDate.getMonth() + 1, day: this.maxDate.getDate()}; 
//     }

//     this.formDatePicker.patchValue({
//       datePicker: this.dateInput
//     })

//   }

//   isOpenDropdown(){
//     this.isOpen = this.dropdown.isOpen();
//   }

//   close(){
//     this.dropdown.close();
//   }

//   chooseDate(event: NgbDate){
//     if(this.onTouched){
//       this.onTouched();
//     }

//     const date = new Date(event.year, event.month - 1, event.day);
//     if(this.timeValue){
//       date.setHours(this.timeValue.hour);
//       date.setMinutes(this.timeValue.minute);
//       date.setSeconds(this.timeValue.second);
//     }else{
//       this.timeValue = {hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds()}
//     }

//     const dateNew = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
//     if( !this.isShowTime){
//       this.dropdown.close();
//     }
//     this.dateInput = dateNew;
//     setTimeout(() =>{
//       this.dateInputChange.emit(this.dateInput);
//     })
//   }

//   chooseTime(event: NgbTime){
//     let date = undefined;
//     if(this.dateInput) date = this.dateInput;
//     if(event && date){
//       date.setHours(event.hour);
//       date.setMinutes(event.minute);
//       date.setSeconds(event.second);
//       this.timeValue = {hour: event.hour, minute: event.minute, second: event.second};
//     }
//     if(date){
//       const dateNew = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
//       this.dateInput = dateNew;
//       setTimeout(() =>{
//         this.dateInputChange.emit(this.dateInput);
//       })
//     }
//   }

//   changeDatetime($event){
//     if(this.onChange){
//       this.onChange($event);
//     }
//     const date = this.convertDateTime($event);
//     if(date instanceof Date){
//       this.timeValue = {hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds()};
//       this.dateInput = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
//       this.dateValue = moment(date);
//       if(this.maxDate && this.dateInput.getTime() > this.maxDate.getTime() && 
//       (this.minDate && this.dateInput.getTime() < this.minDate.getTime())){
//         this.datePicker.onNavigateDateSelect(this.dateValue);
//         this.datePicker.onDateSelect(this.dateValue);
//         this.datePicker.focus();
//       }
//     }
//     setTimeout(() =>{
//       this.dateInputChange.emit(this.dateInput);
//     })
//   }

//   convertDateTime(strDate: string): Date{
//     let result: Date = undefined;
//     if(strDate){
//       const arr = strDate.split(' ');
//       let date = undefined;
//       let time = undefined;
//       if(arr){
//         const partDate = arr.length > 0? arr[0]: undefined;
//         const partTime = arr.length > 0? arr[1]: undefined;
//         if(partDate){
//           const arrDate = partDate.split(this.DELIMITER_DATE);
//           if(arrDate.length === 3){
//             date = {
//               day: arrDate[0].length === 2 ? parseInt(arrDate[0], 10): undefined,
//               month: arrDate[1].length === 2 ? parseInt(arrDate[1], 10): undefined,
//               year: arrDate[2].length === 4 ? parseInt(arrDate[2], 10): undefined,

//             }
//           }
//         }

//         if(partTime){
//           const arrTime = partTime.split(this.DELIMITER_TIME);
//           if(arrTime.length === 3){
//             time = {
//               hour: arrTime[0].length === 2 ? parseInt(arrTime[0], 10): undefined,
//               minute: arrTime[1].length === 2 ? parseInt(arrTime[1], 10): undefined,
//               second: arrTime[2].length === 2 ? parseInt(arrTime[2], 10): undefined,

//             }
//           }
//         }

//       }

//       if(this.type === 'datetime'){
//         if( this.isDateValid(date) && this.isTimeValid(time)){
//           result = new Date(date.year, date.month - 1, date.day, time.hour, time.minute, time.second);
//         }
//       }else if(this.type === 'date'){
//         if(this.isDateValid(date)){
//           result = new Date(date.year, date.month -1, date.day);
//         }
//       }
//     }
//     return result;
//   }

//   isDateValid(date){
//     return date && date.year && date.month && date.day;
//   }

//   isTimeValid(time){
//     return time && time.hour >= 0 && time.minute >= 0 && time.second >= 0;
//   }

//   choose(){
//     this.dropdown.close();
//   }

//   writeValue(obj:any):void{}
//   registerOnChange(fn: any){
//     this.onChange = fn;
//   }

//   registerOnTouched(fn:any){
//     this.onTouched = fn;
//   }

//   change(value){
//     if(this.onChange){
//       this.onChange(value)
//     }
//     if(this.onTouched){
//       this.onTouched(value);
//     }
//     const date = this.convertDateTime(value);

//     if(!date){
//       this.dateInput = undefined;
//     }
//     if(date instanceof Date){
//       this.timeValue = {hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds()}
//       this.dateInput = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
//       this.dateValue = moment(date);

//       if(this.maxDate && this.dateInput.getTime() > this.maxDate.getTime() &&
//       (this.minDate && this.dateInput.getTime() < this.minDate.getTime())){
//         this.datePicker.onNavigateDateSelect(this.dateValue);
//         this.datePicker.onDateSelect(this.dateValue);
//         this.datePicker.focus();
//       }
//     }
//     setTimeout(() =>{
//       this.dateInputChange.emit(this.dateInput);
//     })
//   }

//   validate({value}: FormControl){
//     let error =null;
//     if(value && !this.convertDateTime(value)){
//       error = {pattern: true};
//     }

//     if(this.required && (value === null || value === undefined || value.toString().length === 0)){
//       error = {required: true};
//     }

//     if(this.minDate && this.dateInput && this.minDate.getTime() > this.dateInput.getTime()){
//       error = {min: true};
//     }

//     if(this.maxDate && this.dateInput && this.maxDate.getTime() < this.dateInput.getTime()){
//       error = {max: true};
//     }

//     if(this.formDatePicker){
//       this.formDatePicker.controls['datePicker'].setErrors(error);
//     }

//     return error;
//   }

//   ngOnChanges(changes : SimpleChanges):void{
//     Object.getOwnPropertyNames(changes).forEach(name =>{
//       if(name === 'minDate'){
//         const minDate = changes[name].currentValue;
//         if(minDate){
//           this.min = { year: minDate.getFullYear, month: minDate.getMonth() + 1, day: minDate.getDate()}
//         }
//       }
//     });
//   }

}
