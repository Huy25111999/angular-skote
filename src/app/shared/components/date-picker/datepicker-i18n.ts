import { Injectable } from '@angular/core';
import {NgbDatepickerI18n, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

const I18N_VALUES = {
    'fr':{
        weekdays:['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
        months:['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12' ]
    },
    'vi':{
        weekdays:['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
        months:['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12' ]
    }
};

@Injectable()
export class I18n{
    language = 'vi'
}

@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n{
    constructor(private _i18n: I18n){
        super()
    }

    getWeekdayLabel(weekday: number): string {
        return I18N_VALUES[this._i18n.language].weekdays[weekday -1];
    }
    getWeekLabel(): string{
        return I18N_VALUES[this._i18n.language].weekLabel;
    }

    getMonthShortName(month: number): string {
        return I18N_VALUES[this._i18n.language].months[month -1];
    }
    getMonthFullName(month: number): string {
        return this.getMonthShortName(month);
    }
    getDayAriaLabel(date: NgbDateStruct): string {
        return `${date.day}-${date.month}-${date.year}`
    }
}
