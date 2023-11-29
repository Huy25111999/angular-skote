import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagementUserComponent } from './management-user/management.component';
//import { DetailComponent } from './detail/detail.component';
import { DomainComponent } from './managementDomain/domain/domain.component';
import { AuthGuard } from '../shared/sso/auth.guard';
import { RoleGuard } from '../shared/sso/role.guard';
import { ManagementSSOComponent } from './management-sso/management-sso.component';
import { GroupRoleComponent } from './group-role/group-role.component';
import { ManagementAppComponent } from './management-app/management-group-role.component';
import { CreatAppComponent } from './management-app/creat-app/creat-app.component';
import { EditAppComponent } from './management-app/edit-app/edit-app.component';
const routes: Routes = [
    {
        path: 'user',
        component: ManagementUserComponent,
        canActivate:[AuthGuard]
    },
    // {
    //     path: 'detail/:id',
    //     component: DetailComponent,
    //     canActivate:[AuthGuard]
    // },
    {
        path: 'domain',
        component: DomainComponent,
     //   canActivate:[AuthGuard]
    },
    // {
    //     path: 'user',
    //     component: ManagementUserComponent,
    //     canActivate:[AuthGuard]
    // },
    {
        path: 'sso',
        component: ManagementSSOComponent,
    },
    {
        path: 'edit-app/:id',
        component: EditAppComponent,
       // canActivate:[AuthGuard]
    },
    
    {
        path: 'sso/:id',
        component: ManagementSSOComponent,
    },
    {
        path: 'group-role/:id',
        component: GroupRoleComponent,
    },
    // {
    //     path: 'group-role',
    //     component: GroupRoleComponent,
    // },
    {
        path: 'create-app',
        component: CreatAppComponent,
    },
    {
        path: 'app',
        component: ManagementAppComponent,
        canActivate:[AuthGuard]
    },
    {
        path:'',
        component:ManagementUserComponent,
       canActivate:[AuthGuard]
    },
    { path: 'ant-design', loadChildren: () => import('./ant/ant.module').then(m => m.AntModule)}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SSORoutingModule { }


