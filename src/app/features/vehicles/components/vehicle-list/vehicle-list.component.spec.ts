import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';

import { VehicleListComponent } from './vehicle-list.component';
import { VehicleService } from '../../../../core/services/vehicle.service';
import { AnyVehicle } from '../../../../core/interfaces/vehicle.interface';

// ─────────────────────────────────────────────────────────────────────────────
// Fixture data
// ─────────────────────────────────────────────────────────────────────────────

const mockVehicle: AnyVehicle = {
  id: 'xe',
  name: 'XE',
  modelYear: '2021',
  apiUrl: '/api/vehicles/xe',
  media: [{ name: 'xe 16x9', url: '/images/16x9/xe.jpg' }],
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
// Mock service
//
// We create writable signals so individual tests can call .set() on them to
// simulate different states (loading, error, success) without making any
// real HTTP calls. fetchAll() returns of([]) by default — an Observable that
// completes immediately with an empty array.
// ─────────────────────────────────────────────────────────────────────────────

function createMockVehicleService() {
  return {
    loading: signal(false),
    error: signal<string | null>(null),
    vehicles: signal<AnyVehicle[]>([]),
    fetchAll: vi.fn().mockReturnValue(of([])),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('VehicleListComponent', () => {
  let component: VehicleListComponent;
  let fixture: ComponentFixture<VehicleListComponent>;
  let mockService: ReturnType<typeof createMockVehicleService>;

  beforeEach(async () => {
    mockService = createMockVehicleService();

    await TestBed.configureTestingModule({
      imports: [VehicleListComponent],
      providers: [
        // Replace the real VehicleService with our mock.
        // Angular's DI resolves VehicleService tokens to this object instead.
        { provide: VehicleService, useValue: mockService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── Initialisation ─────────────────────────────────────────────────────────

  it('calls fetchAll() once on init', () => {
    expect(mockService.fetchAll).toHaveBeenCalledTimes(1);
  });

  // ── Loading state ──────────────────────────────────────────────────────────
  //
  // detectChanges() must be called after mutating a signal so Angular
  // re-evaluates the template bindings in the test environment.

  it('shows 6 skeleton placeholders while loading', () => {
    mockService.loading.set(true);
    fixture.detectChanges();

    const skeletons =
      fixture.nativeElement.querySelectorAll('.vehicle-list__skeleton');
    expect(skeletons.length).toBe(6);
  });

  it('does not show the vehicle grid while loading', () => {
    mockService.loading.set(true);
    fixture.detectChanges();

    const grid = fixture.nativeElement.querySelector('.vehicle-list__grid[aria-label="Vehicle list"]');
    expect(grid).toBeNull();
  });

  // ── Error state ────────────────────────────────────────────────────────────

  it('shows the error message when the error signal has a value', () => {
    mockService.error.set('Failed to load vehicles');
    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector(
      '.vehicle-list__error-message',
    );
    expect(errorEl?.textContent?.trim()).toBe('Failed to load vehicles');
  });

  it('does not show the skeleton grid in the error state', () => {
    mockService.error.set('Some error');
    fixture.detectChanges();

    const skeletons =
      fixture.nativeElement.querySelectorAll('.vehicle-list__skeleton');
    expect(skeletons.length).toBe(0);
  });

  // ── Success state ──────────────────────────────────────────────────────────

  it('renders one vehicle card per vehicle in the signal', () => {
    mockService.vehicles.set([mockVehicle, { ...mockVehicle, id: 'xf', name: 'XF' }]);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('app-vehicle-card');
    expect(cards.length).toBe(2);
  });

  it('does not show the error block in the success state', () => {
    mockService.vehicles.set([mockVehicle]);
    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector('.vehicle-list__error');
    expect(errorEl).toBeNull();
  });
});
