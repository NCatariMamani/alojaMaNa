import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccommodationsRoutingModule } from './accommodations-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AccommodatioDetailComponent } from './accommodatio-detail/accommodatio-detail.component';
import { AccommodationListComponent } from './accommodation-list/accommodation-list.component';


@NgModule({
  declarations: [
    AccommodationListComponent,
    AccommodatioDetailComponent
  ],
  imports: [
    CommonModule,
    AccommodationsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ]
})
export class AccommodationsModule { }
