import { ChangeDetectionStrategy, Component, input, viewChild } from '@angular/core';
import { AnyVehicle } from '../../../../core/interfaces/vehicle.interface';
import { VehicleDetailModal } from "../vehicle-detail-modal/vehicle-detail-modal";

@Component({
  selector: 'app-vehicle-card',
  imports: [VehicleDetailModal],
  templateUrl: './vehicle-card.component.html',
  styleUrl: './vehicle-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleCardComponent {
  vehicle = input.required<AnyVehicle>();

  readonly modal = viewChild.required<VehicleDetailModal>('modal');

  /**
   * Used by the parent list to stagger the fade-in animation via
   * [style.animation-delay] bound on the host element.
   */
  index = input(0);

  /**
   * Prefer the 16x9 image; CSS aspect-ratio + object-fit handles the
   * visual crop at all breakpoints so we never need to swap src.
   */
  get imageUrl(): string {
    const { media } = this.vehicle();
    return media.find((m) => m.url.includes('16x9'))?.url ?? media[0]?.url ?? '';
  }

  get emissionsLabel(): string {
    const { template, value } = this.vehicle().meta.emissions;
    return template.replace('$value', String(value));
  }
}
