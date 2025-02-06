import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductInventoryRoutingModule } from './productInventory-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProductInventoryListComponent } from './productInventory-list/productInventory-list.component';
import { ProductInventoryDetailComponent } from './productInventory-detail/productInventory-detail.component';
import { OutputModalComponent } from './output-modal/output-modal.component';
import { InputModalComponent } from './input-modal/input-modal.component';
import { InputListComponent } from './input-list/input-list.component';
import { OutputListComponent } from './output-list/output-list.component';

@NgModule({
  imports: [
    CommonModule,
    ProductInventoryRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
  declarations: [
    ProductInventoryListComponent,
    ProductInventoryDetailComponent,
    InputModalComponent,
    OutputModalComponent,
    InputListComponent,
    OutputListComponent
  ]
})
export class ProductInventoryModule { }
