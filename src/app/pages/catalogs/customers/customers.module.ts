import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersDetailComponent } from './customers-detail/customers-detail.component';
import { CustomersListComponent } from './customers-list/customers-list.component';

@NgModule({
  imports: [
    CommonModule,
    CustomersRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
  declarations: [
    CustomersListComponent,
    CustomersDetailComponent
  ]
})
export class CustomersModule { }
