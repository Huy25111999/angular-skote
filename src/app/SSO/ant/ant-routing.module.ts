import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AntDesignComponent } from './ant-design/ant-design.component';

const routes: Routes = [
  {
    path: '',
    component: AntDesignComponent,
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AntRoutingModule { }
