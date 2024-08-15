import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { InventoriesRoutingModule } from './inventories-routing.module';
import { InventoriesListComponent } from './inventories-list/inventories-list.component';
import { InventoriesDetailComponent } from './inventories-detail/inventories-detail.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    InventoriesRoutingModule
  ],
  declarations: [
    InventoriesListComponent,
    InventoriesDetailComponent
  ]
})
export class InventoriesModule { }
