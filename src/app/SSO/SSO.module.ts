import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementComponent } from './management/management.component';
import { SSORoutingModule } from './SSO-routing.modules';
import { ModalAddComponent } from './modal-add/modal-add.component';
import { ModalEditComponent } from './modal-edit/modal-edit.component';
import { DetailComponent } from './detail/detail.component';
import { DomainComponent } from './managementDomain/domain/domain.component';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from '../app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AddDomainComponent } from './managementDomain/add-domain/add-domain.component';
import { EditDomainComponent } from './managementDomain/edit-domain/edit-domain.component';
import { SearchfilterPipe } from './searchfilter.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { HomeComponent } from './home/home.component';
import { Ng2CompleterModule } from 'ng2-completer';
import { PaginationComponent } from './pagination/pagination.component';

// import { BrowserModule } from '@angular/platform-browser';

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
    HomeComponent,
    PaginationComponent
  ],
  imports: [
    CommonModule,
    SSORoutingModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    Ng2CompleterModule,
    Ng2SmartTableModule,
    HttpClientModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
     NgbModule
    // BrowserModule 
  ],
  bootstrap: [AppComponent]
})
export class SSOModule { }
