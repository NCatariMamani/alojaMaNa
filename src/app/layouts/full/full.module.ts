import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullComponent } from './full.component';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule
  ],
  declarations: [FullComponent],
  exports: [FullComponent],
})
export class FullModule { }
