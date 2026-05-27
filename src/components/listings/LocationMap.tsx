"use client";

import { Card, Stack, Text } from "@mantine/core";
import dynamic from "next/dynamic";

const MapInner = dynamic(() => import("./LocationMapInner"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 300,
        borderRadius: 10,
        background: "linear-gradient(135deg, #e8f4f8 0%, #d4e8f0 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#7c8a94",
        fontSize: 14,
      }}
    >
      Načítám mapu…
    </div>
  ),
});

interface Props {
  city: string;
  lat: number;
  lng: number;
  radius: number;
}

export function LocationMap({ city, lat, lng, radius }: Props) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="sm">
        <Text fw={600} size="lg">
          📍 Lokalita
        </Text>

        <div style={{ borderRadius: 10, overflow: "hidden" }}>
          <MapInner lat={lat} lng={lng} radius={radius} height={300} interactive={true} />
        </div>

        <Text size="sm" c="dimmed">
          Oblast: <strong>{city}</strong>, ~{radius} km
        </Text>
      </Stack>
    </Card>
  );
}
