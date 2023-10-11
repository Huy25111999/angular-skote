import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AntDesignComponent } from './ant-design/ant-design.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";


@NgModule({
  declarations: [
    AntDesignComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    // NzFormModule,
    // NzInputModule
  ]
})
export class AntModule { }
