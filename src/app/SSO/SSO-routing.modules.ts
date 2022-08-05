import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagementComponent } from './management/management.component';
import { DetailComponent } from './detail/detail.component';
import { DomainComponent } from './managementDomain/domain/domain.component';
import { domain } from 'src/app/model/domain';

const routes: Routes = [
    {
        path: 'management',
        component: ManagementComponent
    },
    {
        path: 'detail/:id',
        component: DetailComponent,

    },
    {
        path: 'domain',
        component: DomainComponent
    },
    {
        path:'',
        component:ManagementComponent
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SSORoutingModule { }


