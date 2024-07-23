import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccommodationListComponent } from './accommodation-list/accommodation-list.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: AccommodationListComponent,
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class AccommodationsRoutingModule { }
