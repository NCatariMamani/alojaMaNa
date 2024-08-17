import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { UsersListComponent } from './users-list/users-list.component';
import { UsersDetailComponent } from './users-detail/users-detail.component';

@NgModule({
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
  declarations: [
    UsersListComponent,
    UsersDetailComponent
  ]
})
export class UsersModule { }
