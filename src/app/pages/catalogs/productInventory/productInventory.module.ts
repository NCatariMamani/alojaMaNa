import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductInventoryRoutingModule } from './productInventory-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProductInventoryListComponent } from './productInventory-list/productInventory-list.component';
import { ProductInventoryDetailComponent } from './productInventory-detail/productInventory-detail.component';

@NgModule({
  imports: [
    CommonModule,
    ProductInventoryRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
  declarations: [
    ProductInventoryListComponent,
    ProductInventoryDetailComponent
  ]
})
export class ProductInventoryModule { }
