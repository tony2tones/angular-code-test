import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'vehicles',
    pathMatch: 'full',
  },
  {
    path: 'vehicles',
    loadChildren: () =>
      import('./features/vehicles/vehicles.routes').then((m) => m.VEHICLES_ROUTES),
  },
  {
    // Catch-all — redirect unknown paths back to the vehicle list
    path: '**',
    redirectTo: 'vehicles',
  },
];
