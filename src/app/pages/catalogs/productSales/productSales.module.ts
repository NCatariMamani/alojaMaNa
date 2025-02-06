import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductSalesRoutingModule } from './prductSales-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProductSalesListComponent } from './productSales-list/productSales-list.component';
import { ProductSalesDetailComponent } from './productSales-detail/productSales-detail.component';

@NgModule({
  imports: [
    CommonModule,
    ProductSalesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
  declarations: [
    ProductSalesListComponent,
    ProductSalesDetailComponent
  ]
})
export class ProductSalesModule { }
