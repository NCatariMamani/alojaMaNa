import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationsRoutingModule } from './reservations-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReservationsDetailComponent } from './reservations-detail/reservations-detail.component';
import { ReservationsListComponent } from './reservations-list/reservations-list.component';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    ReservationsRoutingModule,
    TimepickerModule.forRoot(),
  ],
  declarations: [
    ReservationsDetailComponent,
    ReservationsListComponent
  ]
})
export class ReservationsModule { }