import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InChargeListComponent } from './inCharge-list/inCharge-list.component';


const routes: Routes = [
  {
    path: '',
    component: InChargeListComponent,
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class InChargeRoutingModule {

}
