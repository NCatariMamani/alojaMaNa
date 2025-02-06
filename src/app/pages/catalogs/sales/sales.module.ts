import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesRoutingModule } from './sales-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SalesListComponent } from './sales-list/sales-list.component';
import { SalesDetailComponent } from './sales-detail/sales-detail.component';

@NgModule({
  imports: [
    CommonModule,
    SalesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
  declarations: [
    SalesListComponent,
    SalesDetailComponent
  ]
})
export class SalesModule { }
