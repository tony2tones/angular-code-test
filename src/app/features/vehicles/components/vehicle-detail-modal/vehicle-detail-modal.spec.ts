import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDetailModal } from './vehicle-detail-modal';
import { type AnyVehicle } from '../../../../core/interfaces/vehicle.interface';

const mockVehicle: AnyVehicle = {
  id: '1',
  name: 'Test Vehicle',
  modelYear: '2024',
  apiUrl: '/api/vehicles/1',
  media: [{ name: 'hero', url: '/img/hero-16x9.jpg' }],
  description: 'A test vehicle description.',
  price: '£30,000',
  meta: {
    passengers: 5,
    drivetrain: ['AWD'],
    bodystyles: ['SUV'],
    emissions: { template: '$value g/km', value: 120 },
  },
};

describe('VehicleDetailModal', () => {
  let component: VehicleDetailModal;
  let fixture: ComponentFixture<VehicleDetailModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleDetailModal],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleDetailModal);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('vehicle', mockVehicle);
    fixture.componentRef.setInput('emissionsLabel', '120 g/km');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('open() calls showModal() on the dialog element', () => {
    const dialog = fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;
    dialog.showModal = vi.fn();
    component.open();
    expect(dialog.showModal).toHaveBeenCalled();
  });

  it('close() calls close() on the dialog element', () => {
    const dialog = fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;
    dialog.close = vi.fn();
    component.close();
    expect(dialog.close).toHaveBeenCalled();
  });

  it('renders the vehicle name in an h2', () => {
    fixture.detectChanges();
    const h2 = fixture.nativeElement.querySelector('h2') as HTMLElement;
    expect(h2.textContent).toContain('Test Vehicle');
  });

  it('renders the emissions label in a list item', () => {
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('li') as NodeListOf<HTMLElement>;
    const emissionsItem = Array.from(items).find(li => li.textContent?.includes('Emissions'));
    expect(emissionsItem?.textContent).toContain('120 g/km');
  });

  it('clicking the close button calls close() on the dialog element', () => {
    fixture.detectChanges();
    const dialog = fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;
    dialog.close = vi.fn();
    const closeBtn = fixture.nativeElement.querySelector('.vehicle-detail-modal__close') as HTMLButtonElement;
    closeBtn.click();
    expect(dialog.close).toHaveBeenCalled();
  });
});
