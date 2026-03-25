import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { type AnyVehicle } from '../../../../core/interfaces/vehicle.interface';
import { VehicleDetailModal } from '../vehicle-detail-modal/vehicle-detail-modal';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { CarSilhouetteComponent } from '../../../../shared/ui/svg/car-silhouette/car-silhouette.component';

@Component({
  selector: 'app-vehicle-card',
  imports: [VehicleDetailModal, ButtonComponent, CarSilhouetteComponent],
  templateUrl: './vehicle-card.component.html',
  styleUrl: './vehicle-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleCardComponent {
  vehicle = input.required<AnyVehicle>();

  /**
   * Used by the parent list to stagger the fade-in animation via
   * [style.animation-delay] bound on the host element.
   */
  index = input(0);

  imageError = signal(false);

  /**
   * Prefer the 16x9 image; CSS aspect-ratio + object-fit handles the
   * visual crop at all breakpoints so we never need to swap src.
   */
  readonly imageUrl = computed(() => {
    const { media } = this.vehicle();
    return media.find((m) => m.url.includes('16x9'))?.url ?? media[0]?.url ?? '';
  });

  readonly showFallback = computed(() => !this.imageUrl() || this.imageError());

  get emissionsLabel(): string {
    const { template, value } = this.vehicle().meta.emissions;
    return template.replace('$value', String(value));
  }

  onImageError(): void {
    this.imageError.set(true);
  }
}
