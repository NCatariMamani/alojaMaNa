import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProductSalesListComponent } from './productSales-list/productSales-list.component';


const routes: Routes = [
  {
    path: '',
    component: ProductSalesListComponent,
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class ProductSalesRoutingModule {

}
