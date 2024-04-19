import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'home',
        loadChildren: async () =>
          (await import('./admin/home/home.module')).HomeModule,
        data: { title: 'pages' },
    },
];

export const pageRoutes = routes;
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }