import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingRoutingModule } from './shopping-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppingDetailComponent } from './shopping-detail/shopping-detail.component';



@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingDetailComponent
  ],
  imports: [
    CommonModule,
    ShoppingRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ]
})
export class ShoppingModule { }
