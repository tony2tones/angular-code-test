import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { VehicleService } from '../../../../core/services/vehicle.service';
import { VehicleCardComponent } from '../vehicle-card/vehicle-card.component';

@Component({
  selector: 'app-vehicle-list',
  imports: [VehicleCardComponent],
  templateUrl: './vehicle-list.component.html',
  styleUrl: './vehicle-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleListComponent {
  protected readonly vehicleService = inject(VehicleService);

  /** Drives the skeleton loading grid — one placeholder per expected vehicle. */
  protected readonly skeletonCount = Array.from({ length: 6 });
}
