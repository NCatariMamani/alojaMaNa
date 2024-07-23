import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullComponent } from './full.component';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TopbarComponent } from './topbar/topbar.component';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { MenuDynamicComponent } from './sidebar/menu-dynamic/menu-dynamic.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    ProgressbarModule
  ],
  declarations: [FullComponent,
    TopbarComponent,
    MenuDynamicComponent,
    SidebarComponent

  ],
  exports: [FullComponent],
})
export class FullModule { }
