"use client";

import { Alert, Autocomplete, Button, Group, Loader, Slider, Stack, Text, TextInput } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const MapPreview = dynamic(() => import("./LocationMapInner"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 200,
        borderRadius: 8,
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

interface PhotonFeature {
  geometry: {
    coordinates: [number, number]; // [lon, lat]
  };
  properties: {
    name?: string;
    housenumber?: string;
    street?: string;
    city?: string;
    postcode?: string;
  };
}

interface DropdownOption {
  value: string;
  lat: string;
  lon: string;
}

function formatPhotonAddress(props: PhotonFeature["properties"]): string {
  let address = props.name || "";

  if (props.housenumber && props.name !== props.street) {
    address += ` ${props.housenumber}`;
  }

  const additional = [];
  if (props.street && props.street !== props.name)
    additional.push(props.street + (props.housenumber && props.name === props.street ? ` ${props.housenumber}` : ""));
  if (props.city && props.city !== props.name) additional.push(props.city);
  if (props.postcode) additional.push(props.postcode);

  if (additional.length > 0) {
    address += `, ${additional.join(", ")}`;
  }

  return address || "Neznámé místo";
}

interface Props {
  defaultCity?: string | null;
  defaultLat?: string | null;
  defaultLng?: string | null;
  defaultRadius?: number | null;
}

export function LocationPicker({ defaultCity, defaultLat, defaultLng, defaultRadius }: Props) {
  const [city, setCity] = useState(defaultCity ?? "");
  const [searchValue, setSearchValue] = useState(defaultCity ?? "");
  const [debouncedSearch] = useDebouncedValue(searchValue, 600);

  const [lat, setLat] = useState(defaultLat ?? "");
  const [lng, setLng] = useState(defaultLng ?? "");
  const [radius, setRadius] = useState(defaultRadius ?? 10);

  const [options, setOptions] = useState<DropdownOption[]>([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [found, setFound] = useState(!!(defaultLat && defaultLng));

  useEffect(() => {
    if (debouncedSearch.trim().length < 3) {
      setOptions([]);
      return;
    }

    // Zabrání zbytečnému API callu, pokud je hodnota stejná jako aktuálně vybrané město
    if (debouncedSearch === city && found) {
      return;
    }

    let active = true;
    setFetching(true);
    setError("");

    fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(debouncedSearch.trim())}&limit=5`)
      .then((r) => r.json())
      .then((data: { features: PhotonFeature[] }) => {
        if (active) {
          const formattedOptions = data.features.map((f) => ({
            value: formatPhotonAddress(f.properties),
            lat: String(f.geometry.coordinates[1]),
            lon: String(f.geometry.coordinates[0]),
          }));

          // Odstranit duplicity podle textu
          const uniqueOptions = Array.from(new Map(formattedOptions.map((item) => [item.value, item])).values());

          setOptions(uniqueOptions);
          if (uniqueOptions.length === 0) {
            setError("Zadaná adresa nebyla nalezena.");
          }
        }
      })
      .catch(() => {
        if (active) setError("Nepodařilo se vyhledat adresu. Zkontrolujte připojení.");
      })
      .finally(() => {
        if (active) setFetching(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedSearch, city, found]);

  function handleOptionSubmit(val: string) {
    const selected = options.find((o) => o.value === val);
    if (selected) {
      setCity(selected.value);
      setSearchValue(selected.value);
      setLat(selected.lat);
      setLng(selected.lon);
      setFound(true);
      setError("");
    }
  }

  // Reverse geocoding pro případy, kdy máme souřadnice, ale chybí text (např. starší inzeráty)
  useEffect(() => {
    if (found && !city && lat && lng) {
      let active = true;
      fetch(`https://photon.komoot.io/reverse?lon=${lng}&lat=${lat}`)
        .then((r) => r.json())
        .then((data: { features: PhotonFeature[] }) => {
          if (active && data.features && data.features.length > 0) {
            const formatted = formatPhotonAddress(data.features[0].properties);
            setCity(formatted);
            setSearchValue(formatted);
          }
        })
        .catch(() => {});
      return () => {
        active = false;
      };
    }
  }, [found, city, lat, lng]);

  function handleRemove() {
    setCity("");
    setSearchValue("");
    setLat("");
    setLng("");
    setRadius(10);
    setFound(false);
    setError("");
    setOptions([]);
  }

  return (
    <Stack
      gap="sm"
      style={{
        padding: 16,
        borderRadius: 12,
        border: "1px solid rgba(0, 0, 0, 0.08)",
        background: "rgba(0, 0, 0, 0.02)",
      }}
    >
      <Text fw={500} size="sm">
        📍 Lokalita (volitelné)
      </Text>

      {/* Hidden inputs pro FormData */}
      <input type="hidden" name="locationCity" value={found ? city : ""} />
      <input type="hidden" name="locationLat" value={lat} />
      <input type="hidden" name="locationLng" value={lng} />
      <input type="hidden" name="locationRadius" value={found ? String(radius) : ""} />

      {!found ? (
        <Autocomplete
          value={searchValue}
          onChange={(val) => {
            setSearchValue(val);
            setFound(false);
          }}
          onOptionSubmit={handleOptionSubmit}
          data={options.map((o) => o.value)}
          placeholder="např. Masarykova 10, Brno…"
          label="Město nebo přesná adresa"
          rightSection={fetching ? <Loader size="xs" /> : null}
        />
      ) : (
        <TextInput
          label="Vybraná lokace"
          value={city || "Neznámá lokace"}
          readOnly
          variant="filled"
          description="Pro změnu lokace klikněte na Odebrat lokaci"
        />
      )}

      {error && !found && !fetching && searchValue.length >= 3 && (
        <Alert color="red" variant="light">
          {error}
        </Alert>
      )}

      {found && lat && lng && (
        <>
          <div>
            <Text size="sm" fw={500} mb={4}>
              Vzdálenost: {radius} km
            </Text>
            <Slider
              value={radius}
              onChange={setRadius}
              min={1}
              max={50}
              step={1}
              marks={[
                { value: 1, label: "1" },
                { value: 5, label: "5" },
                { value: 10, label: "10" },
                { value: 25, label: "25" },
                { value: 50, label: "50" },
              ]}
              styles={{
                markLabel: { fontSize: 11 },
              }}
            />
          </div>

          <div style={{ borderRadius: 10, overflow: "hidden", marginTop: 8 }}>
            <MapPreview lat={Number(lat)} lng={Number(lng)} radius={radius} height={200} />
          </div>

          <Group justify="flex-end">
            <Button variant="subtle" color="red" size="xs" onClick={handleRemove}>
              ❌ Odebrat lokaci
            </Button>
          </Group>
        </>
      )}
    </Stack>
  );
}
