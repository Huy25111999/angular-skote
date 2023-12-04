import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AntDesignComponent } from './ant-design/ant-design.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AntRoutingModule } from './ant-routing.module';
import { AppComponent } from 'src/app/app.component';


@NgModule({
  declarations: [
    AntDesignComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AntRoutingModule
    // NzFormModule,
    // NzInputModule
  ],
  bootstrap: [AppComponent]
})
export class AntModule { }
