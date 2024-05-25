import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: async () =>
      (await import('./admin/home/home.module')).HomeModule,
    data: { title: 'pages' },
  },
  {
    path: 'catalogs',
    loadChildren: async () =>
      (await import('./catalogs/catalogs.module')).CatalogsModule,
    //data: { title: 'catalogos' },
  },
];

export const pageRoutes = routes;
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }