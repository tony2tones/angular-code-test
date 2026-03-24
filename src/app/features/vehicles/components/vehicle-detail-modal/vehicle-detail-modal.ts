import { ChangeDetectionStrategy, Component, type ElementRef, input, viewChild } from '@angular/core';
import { type AnyVehicle } from '../../../../core/interfaces/vehicle.interface';

@Component({
  selector: 'app-vehicle-detail-modal',
  imports: [],
  templateUrl: './vehicle-detail-modal.html',
  styleUrl: './vehicle-detail-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleDetailModal {

vehicle = input.required<AnyVehicle>();
emissionsLabel = input();

// viewChild give you a signal based reference to the <dialog> element
private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');


open() {
  this.dialog().nativeElement.showModal();
}

close() {
  this.dialog().nativeElement.close();
}



}
