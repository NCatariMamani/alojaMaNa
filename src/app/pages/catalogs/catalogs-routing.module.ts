import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'accommodations',
    loadChildren: async () =>
      (await import('./accommodations/accommodations.module')).AccommodationsModule,
    data: { title: 'Alojamientos' },
  },
  {
    path: 'shopping',
    loadChildren: async () =>
      (await import('./shopping/shopping.module')).ShoppingModule,
    data: { title: 'Compras' },
  },
  {
    path: 'bedrooms',
    loadChildren: async () =>
      (await import('./bedrooms/bedrooms.module')).BedroomsModule,
    data: { title: 'Habitaciones' },
  },
]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class CatalogsRoutingModule { }
