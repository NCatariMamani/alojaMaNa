import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatSidenavModule} from '@angular/material/sidenav';
import { PagesRoutingModule } from './pages-routing.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    PagesRoutingModule
  ]
})
export class PagesModule { }
