import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementUserComponent } from './management-user/management.component';
import { SSORoutingModule } from './SSO-routing.modules';
import { ModalAddComponent } from './management-user/modal-add/modal-add.component';
import { ModalEditComponent } from './management-user/modal-edit/modal-edit.component';
//import { DetailComponent } from './detail/detail.component';
 import { DomainComponent } from './managementDomain/domain/domain.component';
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
// import { ModalUserDomainComponent } from './modal-user-domain/modal-user-domain.component';
import {NgxTrimModule} from 'ngx-trim';
import { TreeviewModule } from 'ngx-treeview';
import { ManagementSSOComponent } from './management-sso/management-sso.component';
import { ModalRoleComponent } from './role/modal-role/modal-role.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { EditRoleComponent } from './role/edit-role/edit-role.component';
import { GroupRoleComponent } from './group-role/group-role.component';
import { AddGroupRoleComponent } from './group-role/add-group-role/add-group-role.component';
import { ManagementAppComponent } from './management-app/management-group-role.component';
import { EditGroupRoleComponent } from './group-role/edit-group-role/edit-group-role.component';
import { ConnectUserRoleComponent } from './connect-user-role/connect-user-role.component';
import { CreatAppComponent } from './management-app/creat-app/creat-app.component';
import { EditAppComponent } from './management-app/edit-app/edit-app.component';
import { DropdownTreeviewSelectComponent } from './group-role/dropdown-treeview-select/dropdown-treeview-select.component';
import { OnSalePipe } from './on-sale.pipe';
import { TreeGridModule} from '@syncfusion/ej2-angular-treegrid';
import { AntModule } from './ant/ant.module';
// import { TreeviewI18nDefault } from './group-role/tree-picker/ngx-treeview';

// import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
// import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
// import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

// const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
//   suppressScrollX: false
// };

@NgModule({
  declarations: [
    ManagementUserComponent,
    ModalAddComponent,
    ModalEditComponent,
   // DetailComponent,
    DomainComponent,
    AddDomainComponent,
    EditDomainComponent,
    SearchfilterPipe,
   // ModalUserDomainComponent,
    ManagementSSOComponent,
    ModalRoleComponent,
    EditRoleComponent,
    GroupRoleComponent,
    AddGroupRoleComponent,
    ManagementAppComponent,
    EditGroupRoleComponent,
    ConnectUserRoleComponent,
    CreatAppComponent,
    EditAppComponent,
    DropdownTreeviewSelectComponent,
    OnSalePipe,
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
    TreeGridModule,
    AntModule,
    TreeviewModule.forRoot(),
    // BrowserModule,
    //PerfectScrollbarModule
  ],
  providers: [
    ManagementUserComponent,
    // {
    //   provide: PERFECT_SCROLLBAR_CONFIG,
    //   useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    // }
  ],
  bootstrap: [AppComponent]
})
export class SSOModule { }