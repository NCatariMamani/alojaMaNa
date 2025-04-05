import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionDetailComponent } from './permission-detail/permission-detail.component';
import { PermissionListComponent } from './permission-list/permission-list.component';
import { PermissionRoutingModule } from './permission-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    CommonModule,
    PermissionRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
  declarations: [PermissionDetailComponent, PermissionListComponent]
})
export class PermissionModule { }
