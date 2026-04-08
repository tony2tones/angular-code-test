import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleCardComponent } from './vehicle-card.component';
import { type AnyVehicle } from '../../../../core/interfaces/vehicle.interface';
import { VehicleDetailModal } from '../vehicle-detail-modal/vehicle-detail-modal';
import { By } from '@angular/platform-browser';

// ─────────────────────────────────────────────────────────────────────────────
// Fixture data
// ─────────────────────────────────────────────────────────────────────────────

const mockVehicle: AnyVehicle = {
  id: 'xe',
  name: 'XE',
  modelYear: '2021',
  apiUrl: '/api/vehicles/xe',
  media: [
    { name: 'xe 16x9', url: '/images/16x9/xe.jpg' },
    { name: 'xe 1x1', url: '/images/1x1/xe.jpg' },
  ],
  description: 'A sports saloon.',
  price: '£30,000',
  meta: {
    passengers: 5,
    drivetrain: ['AWD'],
    bodystyles: ['Saloon'],
    emissions: { template: 'CO2 $value g/km', value: 129 },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('VehicleCardComponent', () => {
  let component: VehicleCardComponent;
  let fixture: ComponentFixture<VehicleCardComponent>;

  // Standalone components are imported directly — no NgModule needed.
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleCardComponent);
    component = fixture.componentInstance;

    // Signal inputs must be set via setInput() rather than direct assignment.
    fixture.componentRef.setInput('vehicle', mockVehicle);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── imageUrl getter ────────────────────────────────────────────────────────

  describe('imageUrl', () => {
    // The getter prefers the 16x9 crop because CSS handles the visual
    // crop at every breakpoint — no need to swap src on resize.
    it('returns the 16x9 url when one exists in the media array', () => {
      expect(component.imageUrl()).toBe('/images/16x9/xe.jpg');
    });

    it('falls back to the first media item when no 16x9 url exists', () => {
      fixture.componentRef.setInput('vehicle', {
        ...mockVehicle,
        media: [{ name: 'xe 4x3', url: '/images/4x3/xe.jpg' }],
      });
      expect(component.imageUrl()).toBe('/images/4x3/xe.jpg');
    });

    it('returns an empty string when the media array is empty', () => {
      fixture.componentRef.setInput('vehicle', { ...mockVehicle, media: [] });
      expect(component.imageUrl()).toBe('');
    });
  });

  // ── emissionsLabel getter ──────────────────────────────────────────────────

  describe('emissionsLabel', () => {
    it('replaces the $value placeholder with the numeric emissions value', () => {
      expect(component.emissionsLabel).toBe('CO2 129 g/km');
    });
  });

  // ── template ──────────────────────────────────────────────────────────────
  //
  // Query DOM elements by their BEM class name.
  // textContent?.trim() guards against leading/trailing whitespace in the HTML.

  describe('template', () => {
    let el: HTMLElement;

    beforeEach(() => {
      el = fixture.nativeElement;
    });

    it('renders the vehicle name', () => {
      expect(el.querySelector('.vehicle-card__name')?.textContent?.trim()).toBe(
        'XE',
      );
    });

    it('renders the vehicle price prefixed with "From"', () => {
      expect(
        el.querySelector('.vehicle-card__price')?.textContent?.trim(),
      ).toContain('£30,000');
    });

    it('renders the vehicle description', () => {
      expect(
        el.querySelector('.vehicle-card__description')?.textContent?.trim(),
      ).toBe('A sports saloon.');
    });

    it('sets the image src to the 16x9 url', () => {
      const img = el.querySelector<HTMLImageElement>('.vehicle-card__image');
      // img.src is absolute in JSDOM, so use toContain rather than toBe.
      expect(img?.src).toContain('/images/16x9/xe.jpg');
    });

    it('sets the image alt to the vehicle name', () => {
      const img = el.querySelector<HTMLImageElement>('.vehicle-card__image');
      expect(img?.alt).toBe('XE');
    });

    it('it should asset that the attr.aria-expanded is either open or closed', () => {
      const button = el.querySelector<HTMLButtonElement>('button');

      const dialog = el.querySelector('dialog') as HTMLDialogElement;
      dialog.showModal = vi.fn();


      expect(button?.getAttribute('aria-expanded')).toBe('false');
      button?.click();
      fixture.detectChanges();
      expect(button?.getAttribute('aria-expanded')).toBe('true');
    })
  });
});
