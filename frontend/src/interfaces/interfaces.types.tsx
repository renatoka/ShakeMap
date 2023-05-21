export type SidebarProps = {
  zoomInCoordinates?: {
    lon: number;
    lat: number;
    zoom: number;
  };
  setZoomInCoordinates(zoomInCoordinates: {
    lon: number;
    lat: number;
    zoom: number;
  }): void;
};

export type PulsingDotProps = {
  index: number;
  lon: number;
  lat: number;
  mag: number;
  depth: number;
  time: string;
  unid: string;
};

export type ColouringServiceProps = {
  magnitude: number;
};

export type RouteErrorProps = {
  title: string;
  description: string;
};

export type RotatingSpeedHelperProps = {
  zoom: number;
};

export interface Inputs {
  firstName: string;
  lastName: string;
  email: string;
}
