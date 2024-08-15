import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductShoppingRoutingModule } from './productShopping-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProductShoppingListComponent } from './productShopping-list/productShopping-list.component';
import { ProductShoppingDetailComponent } from './productShopping-detail/productShopping-detail.component';

@NgModule({
  imports: [
    CommonModule,
    ProductShoppingRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
  declarations: [
    ProductShoppingListComponent,
    ProductShoppingDetailComponent
  ]
})
export class ProductShoppingModule { }
