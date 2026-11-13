import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/home-layout/home-layout').then((m) => m.HomeLayout),
    children: [
      {
        path: '',
        title: 'Início',
        loadComponent: () =>
          import('./features/pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./features/pages/new-galeria/new-galeria').then((m) => m.NewGaleria),
      },
    ],
  },
];
