import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagementComponent } from './management/management.component';
import { ModalAddComponent } from './modal-add/modal-add.component';
import {ModalEditComponent} from './modal-edit/modal-edit.component';
import { DetailComponent } from './detail/detail.component';
import { DomainComponent } from './managementDomain/domain/domain.component';
import { domain } from 'src/app/model/domain';
import { HomeComponent } from './home/home.component';

    var id:any ;
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
        path: 'login',
        component: HomeComponent,

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


