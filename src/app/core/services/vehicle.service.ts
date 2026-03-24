import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { EMPTY, type Observable, catchError, forkJoin, map, of, switchMap } from 'rxjs';
import {
  type AnyVehicle,
  type VehicleDetail,
  type VehicleSummary,
} from '../interfaces/vehicle.interface';

const API_BASE = 'https://frontend-code-test-api-1023992580432.europe-west2.run.app';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly vehicles = signal<AnyVehicle[]>([]);

  private readonly http = inject(HttpClient);

  /**
   * Fetches the vehicle list then retrieves all detail records in parallel.
   * Uses switchMap so any re-trigger cancels the previous in-flight request,
   * and forkJoin because HTTP calls are one-shot (complete after one emission).
   */
  
  fetchAll(): Observable<AnyVehicle[]> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<VehicleSummary[]>(`${API_BASE}/api/vehicles/`).pipe(
      switchMap((summaries) => {
        if (summaries.length === 0) return of([]);
        return forkJoin(
          summaries.map((summary) =>
            this.http.get<VehicleDetail>(`${API_BASE}${summary.apiUrl}`).pipe(
              map((detail) => this.merge(summary, detail)),
              // Per-vehicle errors emit null so forkJoin still completes.
              catchError(() => of(null)),
            ),
          ),
        );
      }),
      map((results) => {
        const vehicles = results.filter((v): v is AnyVehicle => v !== null);

        if (results.length > 0 && vehicles.length === 0) {
          // Every detail request failed — treat it the same as a full outage.
          this.loading.set(false);
          this.error.set('Unable to load vehicle details. Please check your connection and try again.');
          return vehicles;
        }

        this.vehicles.set(vehicles);
        this.loading.set(false);
        return vehicles;
      }),
      catchError((err: unknown) => {
        this.loading.set(false);
        this.error.set(this.friendlyError(err));
        return EMPTY;
      }),
    );
  }

  private friendlyError(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 0) return 'Unable to reach the server. Please check your connection and try again.';
      if (err.status === 404) return 'Vehicle data could not be found. Please try again later.';
      if (err.status >= 500) return 'A server error occurred. Please try again later.';
      return `Request failed (${err.status}). Please try again.`;
    }
    return 'Something went wrong. Please try again.';
  }

  private merge(summary: VehicleSummary, detail: VehicleDetail): AnyVehicle {
    return { ...summary, ...detail };
  }
}
