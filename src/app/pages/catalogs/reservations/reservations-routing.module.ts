import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReservationsListComponent } from './reservations-list/reservations-list.component';


const routes: Routes = [
  {
    path: '',
    component: ReservationsListComponent,
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class ReservationsRoutingModule {

}
