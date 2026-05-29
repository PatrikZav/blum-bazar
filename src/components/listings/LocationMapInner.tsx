// Vnitřní část mapy, která zařizuje samotné zobrazení mapových podkladů a barevného kruhu.
"use client";

import "leaflet/dist/leaflet.css";
import type { LatLngExpression } from "leaflet";
import { Circle, MapContainer, TileLayer } from "react-leaflet";

interface Props {
  lat: number;
  lng: number;
  radius: number;
  height?: number;
  interactive?: boolean;
}

export default function LocationMapInner({ lat, lng, radius, height = 300, interactive = false }: Props) {
  const center: LatLngExpression = [lat, lng];
  const radiusMeters = radius * 1000;

  return (
    <MapContainer
      center={center}
      zoom={getZoomForRadius(radius)}
      style={{ height, width: "100%", borderRadius: 10, zIndex: 0, isolation: "isolate" }}
      scrollWheelZoom={interactive}
      dragging={interactive}
      zoomControl={interactive}
      attributionControl={true}
      key={`${lat}-${lng}-${radius}`}
    >
      <TileLayer attribution="&copy; Google Maps" url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}" />
      <Circle
        center={center}
        radius={radiusMeters}
        pathOptions={{
          color: "#4c6ef5",
          fillColor: "#4c6ef5",
          fillOpacity: 0.15,
          weight: 2,
        }}
      />
    </MapContainer>
  );
}

function getZoomForRadius(radiusKm: number): number {
  if (radiusKm <= 1) return 14;
  if (radiusKm <= 3) return 13;
  if (radiusKm <= 5) return 12;
  if (radiusKm <= 10) return 11;
  if (radiusKm <= 15) return 10;
  if (radiusKm <= 25) return 9;
  if (radiusKm <= 35) return 9;
  return 8;
}
