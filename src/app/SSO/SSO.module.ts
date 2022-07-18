import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementComponent } from './management/management.component';
import { SSORoutingModule } from './SSO-routing.modules';
import { ModalAddComponent } from './modal-add/modal-add.component';
import { ModalEditComponent } from './modal-edit/modal-edit.component';
import { DetailComponent } from './detail/detail.component';
import { DomainComponent } from './domain/domain.component';
import {DataTablesModule} from 'angular-datatables';



@NgModule({
  declarations: [
    ManagementComponent,
    ModalAddComponent,
    ModalEditComponent,
    DetailComponent,
    DomainComponent
  ],
  imports: [
    CommonModule,
    SSORoutingModule,
    DataTablesModule
  
  ]
})
export class SSOModule { }
