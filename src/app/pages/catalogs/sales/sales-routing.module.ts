import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SalesListComponent } from './sales-list/sales-list.component';


const routes: Routes = [
  {
    path: '',
    component: SalesListComponent,
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class SalesRoutingModule {

}
