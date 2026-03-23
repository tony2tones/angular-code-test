import { Component, signal } from '@angular/core';
import { VehicleListComponent } from './features/vehicles/components/vehicle-list/vehicle-list.component';

@Component({
  selector: 'app-root',
  imports: [VehicleListComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('angular-code-test');
}
