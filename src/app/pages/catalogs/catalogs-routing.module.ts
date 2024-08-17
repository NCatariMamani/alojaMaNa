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
  {
    path: 'inventories',
    loadChildren: async () =>
      (await import('./inventories/inventories.module')).InventoriesModule,
    data: { title: 'Inventarios' },
  },
  {
    path: 'products',
    loadChildren: async () =>
      (await import('./products/products.module')).ProductsModule,
    data: { title: 'Productos' },
  },
  {
    path: 'productShopping',
    loadChildren: async () =>
      (await import('./productShopping/productShopping.module')).ProductShoppingModule,
    data: { title: 'Producto Compras' },
  },
  {
    path: 'productInventory',
    loadChildren: async () =>
      (await import('./productInventory/productInventory.module')).ProductInventoryModule,
    data: { title: 'Producto Inventario' },
  },
  {
    path: 'reservations',
    loadChildren: async () =>
      (await import('./reservations/reservations.module')).ReservationsModule,
    data: { title: 'Recervaciones' },
  },
  {
    path: 'sales',
    loadChildren: async () =>
      (await import('./sales/sales.module')).SalesModule,
    data: { title: 'Ventas' },
  },
  {
    path: 'productSales',
    loadChildren: async () =>
      (await import('./productSales/productSales.module')).ProductSalesModule,
    data: { title: 'Producto Venta' },
  },
  {
    path: 'inCharges',
    loadChildren: async () =>
      (await import('./inCharge/inCharge.module')).InChargeModule,
    data: { title: 'Encargados' },
  },
  {
    path: 'users',
    loadChildren: async () =>
      (await import('./users/users.module')).UsersModule,
    data: { title: 'Usuarios' },
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
