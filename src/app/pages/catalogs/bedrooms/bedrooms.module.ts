import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BedroomsRoutingModule } from './bedrooms-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BedroomsDetailComponent } from './bedrooms-detail/bedrooms-detail.component';
import { BedroomsListComponent } from './bedrooms-list/bedrooms-list.component';

@NgModule({
  imports: [
    CommonModule,
    BedroomsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
  declarations: [
    BedroomsListComponent,
    BedroomsDetailComponent
  ]
})
export class BedroomsModule { }
