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
@NgModule({
  declarations: [
    PaginationComponent,
    DatePickerComponent
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
    DatePickerComponent
  ]
})

export class SharedModule { }
