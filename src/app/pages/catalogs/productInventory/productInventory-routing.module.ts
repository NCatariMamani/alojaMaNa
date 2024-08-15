import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProductInventoryListComponent } from './productInventory-list/productInventory-list.component';


const routes: Routes = [
  {
    path: '',
    component: ProductInventoryListComponent,
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class ProductInventoryRoutingModule {

}
