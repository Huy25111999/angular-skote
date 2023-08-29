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
import { DepartSelectComponent } from './components/depart-select/depart-select.component';
import {TreeviewModule} from 'ngx-treeview';
import { TreeSelectComponent } from './components/tree-select/tree-select.component';
import { ImportFileComponent } from './components/import-file/import-file.component';

@NgModule({
  declarations: [
    PaginationComponent,
    DatePickerComponent,
    DateRangePickerComponent,
    AvatarComponent,
    ErrorMessagesComponent,
    DepartSelectComponent,
    TreeSelectComponent,
    ImportFileComponent
  ],
  imports: [
      CommonModule,
      UIModule,
      WidgetModule,
      NgbPaginationModule,
      ReactiveFormsModule,
      FormsModule,
      NgbDatepickerModule,
      TreeviewModule.forRoot(),
  ],
  exports: [
    PaginationComponent,
    DatePickerComponent,
    DateRangePickerComponent,
    AvatarComponent,
    ErrorMessagesComponent,
    DepartSelectComponent,
    TreeSelectComponent,
    ImportFileComponent
  ]
})

export class SharedModule { }
