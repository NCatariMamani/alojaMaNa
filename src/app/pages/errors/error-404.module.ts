import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from './error-404/error.component';
import { Error404RoutingModule } from './error-404-routing.module';

@NgModule({
  imports: [
    CommonModule,
    Error404RoutingModule
  ],
  declarations: [ErrorComponent]
})
export class Error404Module { }
