import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UIModule } from './ui/ui.module';

import { WidgetModule } from './widget/widget.module';
import {NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
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
  ]
})

export class SharedModule { }
