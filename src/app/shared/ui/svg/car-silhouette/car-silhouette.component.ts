import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-car-silhouette',
  templateUrl: './car-silhouette.component.html',
  styleUrl: './car-silhouette.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarSilhouetteComponent {
  primaryColor = input<string>('#1a1a1a');
  secondaryColor = input<string>('#f0f0f0');
  cssClass = input<string>('');
}
