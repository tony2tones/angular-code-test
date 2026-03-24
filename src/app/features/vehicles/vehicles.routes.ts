import type { Routes } from '@angular/router';

export const VEHICLES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/vehicles-shell/vehicles-shell.component').then(
        (m) => m.VehiclesShellComponent,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/vehicle-list/vehicle-list.component').then(
            (m) => m.VehicleListComponent,
          ),
        title: 'Browse Vehicles',
      },
      // Future child routes slot in here, e.g.:
      // { path: ':id', loadComponent: () => import('./pages/vehicle-detail-page/...') }
    ],
  },
];
