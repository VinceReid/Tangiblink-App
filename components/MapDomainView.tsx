import { useRef } from "react";
import MapView, {
  UrlTile,
  MAP_TYPES,
  PROVIDER_DEFAULT,
  Marker,
  Polygon,
} from "react-native-maps";
import OpenLocationCode from "@/utils/openlocationcode";
import { StyleSheet } from "react-native";
import { YStack, useTheme } from "tamagui";

// MapContent component
export function MapDomainView({ domain }: { domain: string }) {
  // Ref for the map component
  const mapRef = useRef<MapView>(null);
  // An array to store all marker refs for the map
  const markerRef = useRef(new Map());

  const theme = useTheme();
  // address of the user

  // Function to get initial region based on the location if available
  function getInitialRegion() {
    const point = OpenLocationCode.decode(domain) as any;
    const { latitudeDelta, longitudeDelta } = zoomToDelta(25);
    let region = {
      latitude: point.latitudeCenter,
      longitude: point.longitudeCenter,
      latitudeDelta: latitudeDelta,
      longitudeDelta: longitudeDelta,
    };
    return region;
  }

  // Function to convert zoom to latitudeDelta and longitudeDelta
  function zoomToDelta(zoom: number) {
    const latitudeDelta = 360 / Math.pow(2, zoom);
    const longitudeDelta = 360 / Math.pow(2, zoom);
    return { latitudeDelta, longitudeDelta };
  }

  // Function to handle map ready
  function onMapReady() {}

  // Function to get the selected marker and polygon based on the domain
  function getSelectedMarkerAndPolygon() {
    if (!domain) {
      return { marker: null, polygon: null };
    }
    const point = OpenLocationCode.decode(domain) as any;
    const selectedMarker = MapMarkerComponent({
      domain: domain,
      point,
    });
    const selectedPolygon = MarkerPolygonComponent({
      domain: domain,
      point,
    });
    return { selectedMarker, selectedPolygon };
  }

  // Create Map Marker and Polygon components based on the domain
  const MapMarkerComponent = ({
    domain,
    point,
  }: {
    domain: string;
    point: any;
  }) => {
    const latitude = point.latitudeCenter;
    const longitude = point.longitudeCenter;
    return (
      <Marker
        key={`marker-view-${domain}`}
        identifier={domain}
        coordinate={{ latitude, longitude }}
        ref={(el) => markerRef.current.set(domain, el)}
        image={require("@/assets/markers/map-marker.png")}
      ></Marker>
    );
  };

  // Create Marker Polygon component based on the domain
  const MarkerPolygonComponent = ({
    domain,
    point,
  }: {
    domain: string;
    point: any;
  }) => {
    const northEast = {
      latitude: point.latitudeHi,
      longitude: point.longitudeHi,
    };
    const southEast = {
      latitude: point.latitudeLo,
      longitude: point.longitudeHi,
    };
    const southWest = {
      latitude: point.latitudeLo,
      longitude: point.longitudeLo,
    };
    const northWest = {
      latitude: point.latitudeHi,
      longitude: point.longitudeLo,
    };
    const opaqueAccentColor = theme.accentColor
      .get()
      .replace(/[^,]+(?=\))/, "0.5");
    const opaqueColor10 = theme.color10.get().replace(/[^,]+(?=\))/, "0.5");
    return (
      <Polygon
        key={`polygon-view-${domain}`}
        coordinates={[northEast, southEast, southWest, northWest]}
        strokeColor={opaqueAccentColor}
        fillColor={opaqueColor10}
        strokeWidth={1}
      />
    );
  };

  // Get the selected marker and polygon
  const { selectedMarker, selectedPolygon } = getSelectedMarkerAndPolygon();

  // MapView component for individual domain view
  return (
    <YStack ov={"hidden"} borderRadius={"$5"} width="100%" height="$20">
      <MapView
        ref={mapRef}
        onMapReady={onMapReady}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        mapType={MAP_TYPES.STANDARD}
        initialRegion={getInitialRegion()}
        loadingEnabled
        loadingIndicatorColor={theme.color9.get()}
      >
        <UrlTile
          urlTemplate="https://grid.plus.codes/grid/wms/{z}/{x}/{y}.png"
          zIndex={-1}
        />
        {selectedMarker}
        {selectedPolygon}
      </MapView>
    </YStack>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});
