import { LngLat, Marker } from "mapbox-gl";

export interface colorsMarks {
  color: string;
  mark: Marker;
}

export interface PlainMarks {
  color: string;
  lnglat: LngLat;
}

export interface PropsAddMarker {
  lng: number;
  lat: number;
  color: string;
}
