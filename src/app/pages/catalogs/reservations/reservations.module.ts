import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationsRoutingModule } from './reservations-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReservationsDetailComponent } from './reservations-detail/reservations-detail.component';
import { ReservationsListComponent } from './reservations-list/reservations-list.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    ReservationsRoutingModule

  ],
  declarations: [
    ReservationsDetailComponent,
    ReservationsListComponent
  ]
})
export class ReservationsModule { }
