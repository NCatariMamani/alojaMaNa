import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BedroomsListComponent } from './bedrooms-list/bedrooms-list.component';


const routes: Routes = [
  {
    path: '',
    component: BedroomsListComponent,
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class BedroomsRoutingModule {

}
