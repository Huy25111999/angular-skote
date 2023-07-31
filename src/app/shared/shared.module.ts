import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UIModule } from './ui/ui.module';
import {
  NgbDatepickerModule,
  NgbPaginationModule,
  NgbTimepickerModule,
  NgbToastModule,
  NgbTooltipModule
} from "@ng-bootstrap/ng-bootstrap";
import { WidgetModule } from './widget/widget.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { PaginationComponent } from './components/pagination/pagination.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { ErrorMessagesComponent } from './components/error-messages/error-messages.component';
@NgModule({
  declarations: [
    PaginationComponent,
    DatePickerComponent,
    DateRangePickerComponent,
    AvatarComponent,
    ErrorMessagesComponent
  ],
    imports: [
        CommonModule,
        UIModule,
        WidgetModule,
        NgbPaginationModule,
        ReactiveFormsModule,
        FormsModule,
        NgbDatepickerModule

    ],
  exports: [
    PaginationComponent,
    DatePickerComponent,
    DateRangePickerComponent,
    AvatarComponent,
    ErrorMessagesComponent
  ]
})

export class SharedModule { }
