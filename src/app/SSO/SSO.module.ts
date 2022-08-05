import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementComponent } from './management/management.component';
import { SSORoutingModule } from './SSO-routing.modules';
import { ModalAddComponent } from './management/modal-add/modal-add.component';
import { ModalEditComponent } from './management/modal-edit/modal-edit.component';
import { DetailComponent } from './detail/detail.component';
import { DomainComponent } from './managementDomain/domain/domain.component';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from '../app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddDomainComponent } from './managementDomain/add-domain/add-domain.component';
import { EditDomainComponent } from './managementDomain/edit-domain/edit-domain.component';
import { SearchfilterPipe } from './searchfilter.pipe';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Ng2CompleterModule } from 'ng2-completer';
import {SharedModule} from "../shared/shared.module";
import { ModalUserDomainComponent } from './modal-user-domain/modal-user-domain.component';
import { AuthInterceptor } from './service/AuthInterceptor';
import {NgxTrimModule} from 'ngx-trim';
@NgModule({
  declarations: [
    ManagementComponent,
    ModalAddComponent,
    ModalEditComponent,
    DetailComponent,
    DomainComponent,
    AddDomainComponent,
    EditDomainComponent,
    SearchfilterPipe,
    ModalUserDomainComponent,
  ],
  imports: [
    CommonModule,
    SSORoutingModule,
    Ng2SearchPipeModule,
    Ng2CompleterModule,
    Ng2SmartTableModule,
    HttpClientModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    SharedModule,
    FormsModule,
    NgxTrimModule
    // BrowserModule
  ],
  providers: [
    ManagementComponent
  ],
  bootstrap: [AppComponent]
})
export class SSOModule { }