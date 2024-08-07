import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './layouts/content/content.component';
import { FullComponent } from './layouts/full/full.component';
import { AuthGuard } from './core/guards/auth.guard';
//import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    component: ContentComponent,
    loadChildren: async () =>
      (await import('./pages/auth/auth.module')).AuthModule,
  },
  {
    path: 'pages',
    component: FullComponent,
    loadChildren: async () =>
      (await import('./pages/pages.module')).PagesModule,
    canActivateChild: [AuthGuard],
  },
  
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: '404-not-found',
    pathMatch: 'full',
    loadChildren: async () =>
      (await import('./pages/errors/error-404.module'))
        .Error404Module,
    data: { title: 'Página no Encontrada' },
  },
  { path: '**', redirectTo: 'auth' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollOffset: [0, 0],
    scrollPositionRestoration: 'top',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
