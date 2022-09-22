import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagementComponent } from './management/management.component';
import { DetailComponent } from './detail/detail.component';
//import { DomainComponent } from './managementDomain/domain/domain.component';
import { domain } from 'src/app/model/domain';
import { AuthGuard } from '../shared/sso/auth.guard';
import { RoleGuard } from '../shared/sso/role.guard';
import { ManagementUserComponent } from './user/management-user/management-user.component';
import { ManagementRoleComponent } from './role/management-role/management-role.component';
import { GroupRoleComponent } from './group-role/group-role.component';
import { ManagementGroupRoleComponent } from './management-group-role/management-group-role.component';

const routes: Routes = [
    {
        path: 'management',
        component: ManagementComponent,
        canActivate:[AuthGuard]
    },
    {
        path: 'detail/:id',
        component: DetailComponent,
        canActivate:[AuthGuard]
    },
    // {
    //     path: 'domain',
    //     component: DomainComponent,
    //     canActivate:[AuthGuard]
    // },
    {
        path: 'user',
        component: ManagementUserComponent,
        canActivate:[AuthGuard]
    },
    {
        path: 'role',
        component: ManagementRoleComponent,
    },
    {
        path: 'role/:id',
        component: ManagementRoleComponent,
    },
    // {
    //     path: 'group-role',
    //     component: GroupRoleComponent,
    // },
    {
        path: 'group-role',
        component: ManagementGroupRoleComponent,
    },
    {
        path:'',
        component:ManagementComponent,
        canActivate:[AuthGuard]
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SSORoutingModule { }


