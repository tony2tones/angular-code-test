import { ChangeDetectionStrategy, Component, inject, type OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { VehicleService } from '../../../../core/services/vehicle.service';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { CarSilhouetteComponent } from '../../../../shared/ui/svg/car-silhouette/car-silhouette.component';
import { VehicleCardComponent } from '../vehicle-card/vehicle-card.component';

@Component({
  selector: 'app-vehicle-list',
  imports: [VehicleCardComponent, ButtonComponent, CarSilhouetteComponent],
  templateUrl: './vehicle-list.component.html',
  styleUrl: './vehicle-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleListComponent implements OnInit {
  protected readonly vehicleService = inject(VehicleService);

  /** Drives the skeleton loading grid — one placeholder per expected vehicle. */
  protected readonly skeletonCount = Array.from({ length: 6 });

  private readonly destroy$ = takeUntilDestroyed();

  ngOnInit(): void {
    this.load();
  }

  protected retry(): void {
    this.load();
  }

  private load(): void {
    this.vehicleService.fetchAll().pipe(this.destroy$).subscribe();
  }
}
