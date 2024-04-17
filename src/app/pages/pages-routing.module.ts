import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'home',
        loadChildren: async () =>
          (await import('./admin/home/home.module')).HomeModule,
        data: { title: 'Home' },
      },
];