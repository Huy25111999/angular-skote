import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagementComponent } from './management/management.component';
import { ModalAddComponent } from './modal-add/modal-add.component';
import {ModalEditComponent} from './modal-edit/modal-edit.component';
import { DetailComponent } from './detail/detail.component';
import { DomainComponent } from './domain/domain.component';




const routes: Routes = [
    {
        path: 'management',
        component: ManagementComponent
    },
    {
        path: 'detail',
        component: DetailComponent
    },
    {
        path: 'domain',
        component: DomainComponent
    },
    {
        path: 'modadAdd',
        component: ModalAddComponent
    },
    {
      path: 'modadEdit',
      component: ModalEditComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SSORoutingModule { }
