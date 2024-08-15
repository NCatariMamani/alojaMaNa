import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductsDetailComponent } from './products-detail/products-detail.component';
import { ProductsRoutingModule } from './products-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    ProductsRoutingModule
  ],
  declarations: [
    ProductsListComponent,
    ProductsDetailComponent
  ]
})
export class ProductsModule { }
