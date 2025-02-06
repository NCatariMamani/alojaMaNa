import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InChargeRoutingModule } from './inCharge-routing.module';
import { InChargeListComponent } from './inCharge-list/inCharge-list.component';
import { InChargeDetailComponent } from './inCharge-detail/inCharge-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    CommonModule,
    InChargeRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
  declarations: [
    InChargeListComponent,
    InChargeDetailComponent
  ]
})
export class InChargeModule { }
