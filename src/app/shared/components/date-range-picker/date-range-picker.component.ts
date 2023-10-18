import {Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {Subject} from "rxjs";
import {
  NgbCalendar,
  NgbDate,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDatepickerI18n,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import {CustomDateParserFormatter, CustomAdapter} from '../date-picker/datepicker-adapter';
import * as moment from "moment";
import {AbstractControl} from '@angular/forms'
import {CustomDatepickerI18n, I18n} from "../date-picker/datepicker-i18n";
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
  providers: [
    I18n,
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n},
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    {provide: NgbDateAdapter, useClass: CustomAdapter}
  ],
})
export class DateRangePickerComponent implements OnInit {

  hoveredDate: NgbDate;
  @Input() fromOutDate: Date;
  @Input() toOutDate: Date;
  @Input() control: AbstractControl
  @Input() maxDate: any = null;
  @Input() isRequired: any = false;
  hidden = true;
  selected: any;
  model: NgbDateStruct;
  date:{year: number, month: number};
  fromDate: NgbDate;
  toDate: NgbDate;
  @Output() dateRangeSelected: EventEmitter<{}> = new EventEmitter();
  @Output() hiddenOutput: EventEmitter<{}> = new EventEmitter();
  @ViewChild('dp', {static: true}) datePicker: any;
  inputSubject = new Subject();
  valid = true;
  errorOverToDate:any = false;

  constructor(
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
  ) { 
  }

  ngOnInit(): void {
    if(this.control.value){
      this.initDate(this.control.value)
    }
    this.control.valueChanges.subscribe(value => {
      if(!value){
        this.selected = null;
        this.toDate = null;
        this.fromDate = null;
        this.fromOutDate = null;
        this.toOutDate = null;
      }else{
        this.initDate(value);
      }
    });

    this.inputSubject.pipe().subscribe(value =>{
      if( !value  || value === ''){
        this.selected = null;
        this.fromDate = null;
        this.toDate = null;
        this.errorOverToDate = false;
        this.control.setValue(null, {emitEvent: true});
        return ;
      }
      const listDate = value.toString().split('-');
      const fromDate = listDate[0] ? listDate[0].trim() : null;
      const toDate = listDate[1] ? listDate[1].trim() : null;
      const regux = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
      this.fromOutDate = null;
      this.toOutDate = null;
      this.control.setValue(null,{emitEvent:true});
      this.errorOverToDate = false; 
      this.valid = true;
      if(!regux.test(fromDate)){
        this.valid = false;
        return 
      }
      if(!regux.test(toDate)){
        this.valid = false;
        return 
      }
      if(moment(fromDate,'DD/MM/YYYY hh:mm:ss').isAfter(moment(toDate,'DD/MM/YYYY hh:mm:ss'), 'milliseconds')){
        this.errorOverToDate = true; 
        return
      }
      this.fromOutDate = moment(fromDate, 'DD/MM/YYYY hh:mm:ss').toDate();
      this.toOutDate = moment(toDate, 'DD/MM/YYYY hh:mm:ss').toDate();
      this.control.setValue({fromDate: this.fromOutDate, toDate: this.toOutDate});

    })
  }

  onBlurDate(){

  }
  initDate(value){
    if(value.fromDate){
      this.fromDate = new NgbDate(value.fromDate.getFullYear(),value.fromDate.getMonth() + 1,value.fromDate.getDate());
      this.fromOutDate = value.fromDate;
    }
    if(value.toDate){
      this.toDate = new NgbDate(value.toDate.getFullYear(),value.toDate.getMonth() + 1,value.toDate.getDate());
      this.toOutDate = value.toDate;
    }
    if(!this.fromDate &&  !this.toDate){
      this.selected = ""
    }else if(this.fromDate && this.toDate && (this.toDate.equals(this.fromDate) || this.toDate.after(this.fromDate))){
      this.selected = moment(this.fromOutDate).format("DD/MM/YYYY") + " - " + moment(this.toOutDate).format("DD/MM/YYYY") ;
    }else{
      this.selected = "";
      this.control.setValue(null, {emitEvents: true});
    }
  }
  
  onClose(){
    if(!this.hidden){
      if(!this.isRequired){
        this.hidden = !this.hidden;
      }
    }else{
      this.hidden = !this.hidden;
    }
  }

  
  onDateSelection(date: NgbDate){
    this.valid  = true;
    this.errorOverToDate  = false;
    if(!this.fromDate && !this.toDate){
      this.fromDate =date;
      this.fromOutDate = new Date(date.year, date.month -1, date.day);
      this.selected = '';
    }
    else if(this.fromDate && !this.toDate && (date.equals(this.fromDate) || date.after(this.fromDate))){
      this.toDate = date;
      this.toOutDate = new Date(date.year, date.month -1, date.day);
      this.hidden = true;
      this.selected = moment(this.fromOutDate).format("DD/MM/YYYY") + " - " + moment(this.toOutDate).format("DD/MM/YYYY") ;
      this.dateRangeSelected.emit({fromDate: this.fromOutDate, toDate: this.toOutDate});
      this.control.setValue({fromDate: this.fromOutDate, toDate: this.toOutDate});
      this.hiddenOutput.emit(true);
    }else{
      this.toDate = null;
      this.fromDate = date;
      this.fromOutDate = new Date(date.year, date.month -1, date.day);
      this.selected = ''
    } 
  }

  isHovered(date: NgbDate){
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }
  isInside(date: NgbDate){
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }
  isRange(date: NgbDate){
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }
  selectToday(){
    this.model = this.calendar.getToday();
  }

  clear(){
    this.selected = null;
    this.valid = true;
    this.toDate = null;
    this.fromDate = null;
    this.fromOutDate = null;
    this.toOutDate = null;
    this.errorOverToDate = false;
    this.control.setValue(null);
  }

  evenClick(){
    if(!this.hidden){
      if(!this.isRequired){
        this.hidden = !this.hidden;
        this.hiddenOutput.emit(this.hidden);
      }
    }else{
      this.hidden = !this.hidden;
    }
  }
  eventClose(){
    this.hidden = true;
    this.hiddenOutput.emit(this.hidden);
  }
  inputByEnter(event: any){
    this.valid = true;
    this.inputSubject.next(event);
  }
  validate(){
    if(moment(this.fromOutDate).isAfter(moment(this.toDate), 'days')){
      this.control.setErrors({isOverDate: true});
    }
  }


}
