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
@NgModule({
  declarations: [
    PaginationComponent
  ],
  imports: [
    CommonModule,
    UIModule,
    WidgetModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    FormsModule

  ],
  exports: [
    PaginationComponent
  ]
})

export class SharedModule { }
