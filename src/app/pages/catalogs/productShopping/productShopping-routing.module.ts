import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProductShoppingListComponent } from './productShopping-list/productShopping-list.component';


const routes: Routes = [
  {
    path: '',
    component: ProductShoppingListComponent,
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class ProductShoppingRoutingModule {

}
