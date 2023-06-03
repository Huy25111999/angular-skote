import {Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges} from '@angular/core';
import {Subject} from "rxjs";
import {
  NgbCalendar,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDatepickerI18n,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import {CustomDateParserFormatter, CustomAdapter} from './datepicker-adapter';
import * as moment from "moment";
import {AbstractControl} from '@angular/forms'
import {CustomDatepickerI18n, I18n} from "./datepicker-i18n";

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],  providers: [
    I18n,
    {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n},
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    {provide: NgbDateAdapter, useClass: CustomAdapter}
  ],
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
      if(a !== 'Invalid Date'){
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
    this.date.emit(this.model);
    this.inputSubject.next(event);
  }
  parseValue(){
    if(this.control.value){
      this.model = moment(this.control.value, 'DD/MM/YYYYTHH:mm:ss').format('DD/MM/YYYY');
    }
  }
  clear(){
    this.control.setValue(null);
    this.model = null
  }

}
