import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AnyVehicle } from '../../../../core/interfaces/vehicle.interface';

@Component({
  selector: 'app-vehicle-card',
  imports: [],
  templateUrl: './vehicle-card.component.html',
  styleUrl: './vehicle-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleCardComponent {
  @Input({ required: true }) vehicle!: AnyVehicle;

  /**
   * Used by the parent list to stagger the fade-in animation via
   * [style.animation-delay] bound on the host element.
   */
  @Input() index = 0;

  /**
   * Prefer the 16x9 image; CSS aspect-ratio + object-fit handles the
   * visual crop at all breakpoints so we never need to swap src.
   */
  get imageUrl(): string {
    return (
      this.vehicle.media.find((m) => m.url.includes('16x9'))?.url ??
      this.vehicle.media[0]?.url ??
      ''
    );
  }

  get emissionsLabel(): string {
    const { template, value } = this.vehicle.meta.emissions;
    return template.replace('$value', String(value));
  }
}
