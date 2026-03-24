import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { VehicleService } from './vehicle.service';
import { type VehicleDetail, type VehicleSummary } from '../interfaces/vehicle.interface';

// ─────────────────────────────────────────────────────────────────────────────
// Shared test fixtures
//
// Define minimal objects that satisfy the interface. Keeping them at the top
// makes it easy to reuse across tests and update when the interface changes.
// ─────────────────────────────────────────────────────────────────────────────

const API_BASE =
  'https://frontend-code-test-api-1023992580432.europe-west2.run.app';

const mockSummary: VehicleSummary = {
  id: 'xe',
  name: 'XE',
  modelYear: '2021',
  apiUrl: '/api/vehicles/xe',
  media: [{ name: 'xe 16x9', url: '/images/16x9/xe.jpg' }],
};

const mockDetail: VehicleDetail = {
  id: 'xe',
  description: 'A sports saloon',
  price: '£30,000',
  meta: {
    passengers: 5,
    drivetrain: ['AWD'],
    bodystyles: ['Saloon'],
    emissions: { template: 'CO2 $value g/km', value: 129 },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper — flushes the list request then each vehicle detail request.
// Extracted so individual tests only need to describe their own scenario.
// ─────────────────────────────────────────────────────────────────────────────
function flushSuccess(
  httpMock: HttpTestingController,
  summaries = [mockSummary],
  detail = mockDetail,
): void {
  httpMock.expectOne(`${API_BASE}/api/vehicles/`).flush(summaries);
  summaries.forEach((s) =>
    httpMock.expectOne(`${API_BASE}${s.apiUrl}`).flush(detail),
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('VehicleService', () => {
  let service: VehicleService;
  let httpMock: HttpTestingController;

  // beforeEach runs before every `it` block.
  // provideHttpClientTesting() intercepts real HTTP calls and lets us
  // control responses manually — no real network requests are made.
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(VehicleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // afterEach verifies no unexpected HTTP requests were made.
  // If a test triggers a request it didn't explicitly expect, this will fail.
  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ── Initial state ──────────────────────────────────────────────────────────

  describe('initial signal values', () => {
    // Signals are just functions — call them with () to read the value.
    it('loading starts as false', () => {
      expect(service.loading()).toBe(false);
    });

    it('error starts as null', () => {
      expect(service.error()).toBeNull();
    });

    it('vehicles starts as an empty array', () => {
      expect(service.vehicles()).toEqual([]);
    });
  });

  // ── fetchAll() — happy path ────────────────────────────────────────────────

  describe('fetchAll() — success', () => {
    it('sets loading to true immediately before any response arrives', () => {
      service.fetchAll().subscribe();

      // At this point the HTTP request is in-flight — loading should be true.
      expect(service.loading()).toBe(true);

      // Clean up: satisfy the pending requests so afterEach verify() passes.
      flushSuccess(httpMock);
    });

    it('populates the vehicles signal with merged data', () => {
      service.fetchAll().subscribe();
      flushSuccess(httpMock);

      const vehicles = service.vehicles();
      expect(vehicles.length).toBe(1);

      // The merged vehicle should have fields from both summary and detail.
      expect(vehicles[0].name).toBe('XE');
      expect(vehicles[0].price).toBe('£30,000');
      expect(vehicles[0].description).toBe('A sports saloon');
    });

    it('sets loading to false after success', () => {
      service.fetchAll().subscribe();
      flushSuccess(httpMock);

      expect(service.loading()).toBe(false);
    });

    it('clears any previous error on a fresh call', () => {
      // Simulate a stale error from a previous failed call.
      service.error.set('old error');

      service.fetchAll().subscribe();

      // The error should be cleared as soon as fetchAll() is called,
      // before any response arrives.
      expect(service.error()).toBeNull();

      flushSuccess(httpMock);
    });
  });

  // ── fetchAll() — error paths ───────────────────────────────────────────────

  describe('fetchAll() — list request fails', () => {
    it('sets the error signal with the response message', () => {
      service.fetchAll().subscribe();

      httpMock
        .expectOne(`${API_BASE}/api/vehicles/`)
        .flush('Internal Server Error', {
          status: 500,
          statusText: 'Server Error',
        });

      expect(service.error()).toBeTruthy();
    });

    it('sets loading to false after a list failure', () => {
      service.fetchAll().subscribe();

      httpMock
        .expectOne(`${API_BASE}/api/vehicles/`)
        .flush('Error', { status: 500, statusText: 'Server Error' });

      expect(service.loading()).toBe(false);
    });
  });

  describe('fetchAll() — one detail request fails', () => {
    // This tests the resilience pattern: a single bad vehicle record should
    // not kill the entire list. The failing request emits null, which is
    // filtered out, so the rest of the vehicles still appear.
    it('still returns the other vehicles when one detail request fails', () => {
      const secondSummary: VehicleSummary = {
        ...mockSummary,
        id: 'xf',
        name: 'XF',
        apiUrl: '/api/vehicles/xf',
      };

      service.fetchAll().subscribe();

      httpMock
        .expectOne(`${API_BASE}/api/vehicles/`)
        .flush([mockSummary, secondSummary]);

      // XE succeeds, XF fails.
      httpMock.expectOne(`${API_BASE}/api/vehicles/xe`).flush(mockDetail);
      httpMock
        .expectOne(`${API_BASE}/api/vehicles/xf`)
        .flush('Not Found', { status: 404, statusText: 'Not Found' });

      expect(service.vehicles().length).toBe(1);
      expect(service.vehicles()[0].id).toBe('xe');
    });
  });
});
