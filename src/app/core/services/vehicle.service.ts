import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import {
  EMPTY,
  Observable,
  catchError,
  forkJoin,
  map,
  switchMap,
} from 'rxjs';
import {
  AnyVehicle,
  VehicleDetail,
  VehicleSummary,
} from '../interfaces/vehicle.interface';

const API_BASE =
  'https://frontend-code-test-api-1023992580432.europe-west2.run.app';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor(private readonly http: HttpClient) {}

  /**
   * Fetches the vehicle list then retrieves all detail records in parallel.
   * Uses switchMap so any re-trigger cancels the previous in-flight request,
   * and forkJoin because HTTP calls are one-shot (complete after one emission).
   */
  fetchAll(): Observable<AnyVehicle[]> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<VehicleSummary[]>(`${API_BASE}/api/vehicles/`).pipe(
      switchMap((summaries) =>
        forkJoin(
          summaries.map((summary) =>
            this.http
              .get<VehicleDetail>(`${API_BASE}${summary.apiUrl}`)
              .pipe(
                map((detail) => this.merge(summary, detail)),
                // Per-vehicle errors are swallowed so one bad record
                // (e.g. "problematic") doesn't kill the entire list.
                catchError(() => EMPTY),
              ),
          ),
        ),
      ),
      map((vehicles) => {
        this.loading.set(false);
        return vehicles;
      }),
      catchError((err: Error) => {
        this.loading.set(false);
        this.error.set(err.message ?? 'Failed to load vehicles');
        return EMPTY;
      }),
    );
  }

  private merge(summary: VehicleSummary, detail: VehicleDetail): AnyVehicle {
    return { ...summary, ...detail };
  }
}
