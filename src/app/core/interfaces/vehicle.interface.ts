export interface VehicleMedia {
  name: string;
  url: string;
}

export interface VehicleEmissions {
  template: string;
  value: number;
}

export interface VehicleMeta {
  passengers: number;
  drivetrain: string[];
  bodystyles: string[];
  emissions: VehicleEmissions;
}

export type Vehicles = {
  id: string,
  name: string,
  modelYear: string,
  apiUrl: string,
  media: Media[],
}

type Media = {
  name: string,
  url:string,
}

/** Shape returned by GET /api/vehicles/ */
export interface VehicleSummary {
  id: string;
  name: string;
  modelYear: string;
  apiUrl: string;
  media: VehicleMedia[];
}

/** Shape returned by GET /api/vehicles/:id */
export interface VehicleDetail {
  id: string;
  description: string;
  price: string;
  meta: VehicleMeta;
}

/** Merged type used throughout the application */
export interface Vehicle extends VehicleSummary, VehicleDetail {}

/**
 * Discriminated union — extend with Motorbike when the API supports it.
 * e.g. type AnyVehicle = Car | Motorbike;
 */
export type AnyVehicle = Vehicle;
