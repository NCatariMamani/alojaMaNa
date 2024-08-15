import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InventoriesListComponent } from './inventories-list/inventories-list.component';


const routes: Routes = [
  {
    path: '',
    component: InventoriesListComponent,
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class InventoriesRoutingModule {

}
