import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Layout shell for the vehicles feature.
 *
 * Owns the <router-outlet> so all child routes (list, detail page,
 * comparison, etc.) render inside this shared layout. Add a persistent
 * header, sidebar, or breadcrumb here when needed — child routes
 * stay unaware of the surrounding chrome.
 */
@Component({
  selector: 'app-vehicles-shell',
  imports: [RouterOutlet],
  templateUrl: './vehicles-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehiclesShellComponent {}
