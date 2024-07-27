import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullComponent } from './full.component';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TopbarComponent } from './topbar/topbar.component';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { MenuDynamicComponent } from './sidebar/menu-dynamic/menu-dynamic.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PopoverModule } from 'ngx-bootstrap/popover';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    ProgressbarModule,
    BrowserAnimationsModule,
    NgScrollbarModule,
    BsDropdownModule,
    RouterModule,
    TooltipModule.forRoot(),
    PopoverModule
  ],
  declarations: [FullComponent,
    TopbarComponent,
    MenuDynamicComponent,
    SidebarComponent

  ],
  exports: [FullComponent],
})
export class FullModule { }
