export type EarthquakePromise = Promise<{
  earthquakes?: Earthquake[];
  count?: number;
  error?: any;
}>;

export interface Earthquake {
  id: number;
  auth: string;
  depth: number;
  evtype: string;
  flynn_region: string;
  lastupdate: Date;
  lat: number;
  lon: number;
  mag: number;
  magtype: string;
  source_catalog: string;
  source_id: string;
  time: Date;
  unid: string;
}

export interface UserPromise {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  activeSubscription: boolean;
}
