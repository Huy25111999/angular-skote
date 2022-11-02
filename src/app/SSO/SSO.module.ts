import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementComponent } from './management/management.component';
import { SSORoutingModule } from './SSO-routing.modules';
import { ModalAddComponent } from './management/modal-add/modal-add.component';
import { ModalEditComponent } from './management/modal-edit/modal-edit.component';
import { DetailComponent } from './detail/detail.component';
// import { DomainComponent } from './managementDomain/domain/domain.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { TreeviewModule } from 'ngx-treeview';
import { ManagementUserComponent } from './user/management-user/management-user.component';
import { ManagementRoleComponent } from './role/management-role/management-role.component';
import { ModalRoleComponent } from './role/modal-role/modal-role.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { EditRoleComponent } from './role/edit-role/edit-role.component';
import { GroupRoleComponent } from './group-role/group-role.component';
import { AddGroupRoleComponent } from './group-role/add-group-role/add-group-role.component';
import { ManagementGroupRoleComponent } from './management-group-role/management-group-role.component';
import { EditGroupRoleComponent } from './group-role/edit-group-role/edit-group-role.component';
import { EditByRoleComponent } from './group-role/edit-by-role/edit-by-role.component';
import { ConnectUserRoleComponent } from './connect-user-role/connect-user-role.component';
import { CreatAppComponent } from './creat-app/creat-app.component';
import { EditAppComponent } from './edit-app/edit-app.component';
import { DropdownTreeviewSelectComponent } from './group-role/dropdown-treeview-select/dropdown-treeview-select.component';
// import { TreeviewI18nDefault } from './group-role/tree-picker/ngx-treeview';

@NgModule({
  declarations: [
    ManagementComponent,
    ModalAddComponent,
    ModalEditComponent,
    DetailComponent,
 //   DomainComponent,
    AddDomainComponent,
    EditDomainComponent,
    SearchfilterPipe,
    ModalUserDomainComponent,
    ManagementUserComponent,
    ManagementRoleComponent,
    ModalRoleComponent,
    EditRoleComponent,
    GroupRoleComponent,
    AddGroupRoleComponent,
    ManagementGroupRoleComponent,
    EditGroupRoleComponent,
    EditByRoleComponent,
    ConnectUserRoleComponent,
    CreatAppComponent,
    EditAppComponent,
    DropdownTreeviewSelectComponent
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
    NgbModule,
    SharedModule,
    FormsModule,
    NgSelectModule,
    NgxTrimModule,
    TreeviewModule.forRoot(),
    // BrowserModule
  ],
  providers: [
    ManagementComponent
  ],
  bootstrap: [AppComponent]
})
export class SSOModule { }