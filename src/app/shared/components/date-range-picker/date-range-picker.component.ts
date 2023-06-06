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
  errorOverTodate = false;

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

  }

  initDate(value){
    if(value.fromDate){
      
    }
  }
  

}
