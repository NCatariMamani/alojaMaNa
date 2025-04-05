import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleDetailComponent } from './role-detail/role-detail.component';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleRoutingModule } from './role-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RoleModalComponent } from './role-modal/role-modal.component';

@NgModule({
  imports: [
    CommonModule,
    RoleRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
  declarations: [RoleListComponent, RoleDetailComponent, RoleModalComponent]
})
export class RoleModule { }
