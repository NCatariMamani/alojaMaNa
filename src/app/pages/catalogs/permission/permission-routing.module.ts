import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PermissionListComponent } from './permission-list/permission-list.component';


const routes: Routes = [
  {
    path: '',
    component: PermissionListComponent,
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class PermissionRoutingModule {

}