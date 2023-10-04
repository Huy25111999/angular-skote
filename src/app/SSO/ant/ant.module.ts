import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AntRoutingModule } from './ant-routing.module';
import { AntDesignComponent } from './ant-design/ant-design.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NzFormModule } from 'ng-zorro-antd/form';


@NgModule({
  declarations: [
    AntDesignComponent,
  ],
  imports: [
    CommonModule,
    AntRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    // NzFormModule,
    // NzInputModule
  ]
})
export class AntModule { }
