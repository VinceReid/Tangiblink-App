import { useEffect, useRef } from "react";
import {
  UrlTile,
  MAP_TYPES,
  PROVIDER_DEFAULT,
  Region,
  Marker,
  Polygon,
  LatLng,
  Callout,
} from "react-native-maps";
import { default as RnMap } from "react-native-maps";
import MapView from "react-native-map-clustering";
import OpenLocationCode from "@/utils/openlocationcode";
import { StyleSheet } from "react-native";
import useContractData from "@/hooks/useContractData";
import { MapDomainFlashList } from "@/components/MapDomainFlashList";
import { useActiveAccount } from "thirdweb/react";
import { ViewArrow } from "@/components/ViewArrow";
import { useMapStore } from "@/store/mapStore";
import { useLocationPermissionStore } from "@/components/LocationPermissionRequest";
import { useAppSettings } from "@/store/settingsStore";
import { LucideIcon } from "@/components/LucideIcons";
import { XStack, YStack, Separator, useTheme, View } from "tamagui";
import { ThemedText } from "@/components/ThemedText";

// MapContent component
export default function MapContent() {
  // Destructuring the store
  const mapLoading = useMapStore((state) => state.mapLoading);
  const location = useLocationPermissionStore((state) => state.location);
  const region = useMapStore((state) => state.region);
  const zoom = useMapStore((state) => state.zoom);
  const selectedDomain = useMapStore((state) => state.selectedDomain);
  const focusedDomainCard = useMapStore((state) => state.focusedDomainCard);
  const viewDomain = useMapStore((state) => state.viewDomain);
  const ownedMarkers = useMapStore((state) => state.ownedMarkers);
  const ownedPolygons = useMapStore((state) => state.ownedPolygons);
  const setMapLoading = useMapStore((state) => state.setMapLoading);
  const setRegion = useMapStore((state) => state.setRegion);
  const setZoom = useMapStore((state) => state.setZoom);
  const setSelectedDomain = useMapStore((state) => state.setSelectedDomain);
  const setFocusedDomainCard = useMapStore(
    (state) => state.setFocusedDomainCard
  );
  const setClosestDomain = useMapStore((state) => state.setClosestDomain);
  const setOwnedMarkers = useMapStore((state) => state.setOwnedMarkers);
  const setOwnedPolygons = useMapStore((state) => state.setOwnedPolygons);
  const setDomainsInViewport = useMapStore(
    (state) => state.setDomainsInViewport
  );
  const locationPermission = useAppSettings(
    (state) => state.locationPermission
  );

  const { domainsArray } = useContractData();

  // Ref for the superCluster
  const superClusterRef = useRef<any>(null);
  // Ref for the map component
  const mapRef = useRef<RnMap>(null);
  // An array to store all marker refs for the map
  const markerRef = useRef(new Map());

  const theme = useTheme();
  // address of the user
  const account = useActiveAccount();

  useEffect(() => {
    const { markers, polygons } = getOwnedMarkersAndPolygons();
    if (selectedDomain && domainsArray.data?.includes(selectedDomain)) {
      setSelectedDomain(null);
    }
    setOwnedMarkers(markers);
    setOwnedPolygons(polygons);
    processItemsInView(region);
  }, [domainsArray.data]);

  // Function to convert zoom to latitudeDelta and longitudeDelta
  function zoomToDelta(zoom: number) {
    const latitudeDelta = 360 / Math.pow(2, zoom);
    const longitudeDelta = 360 / Math.pow(2, zoom);
    return { latitudeDelta, longitudeDelta };
  }

  // Function to calculate the zoom level based on the region
  function calculateZoom(region: Region) {
    const zoomLevelCalculation =
      Math.log(360 / region.longitudeDelta) / Math.LN2;
    const zoom = Math.round(zoomLevelCalculation);
    return zoom;
  }

  // Function to handle zoom change based on the region
  function handleZoomChange(region: Region) {
    const zoom = calculateZoom(region);
    setZoom(zoom);
    return zoom;
  }

  // Function to handle on map press
  function handleOnMapPress(e: LatLng) {
    const latitude = e.latitude;
    const longitude = e.longitude;
    const domain = OpenLocationCode.encode(latitude, longitude, 11);
    if (domain && !domainsArray.data?.includes(domain)) {
      setSelectedDomain(domain);
    }
  }

  // useEffect to handle open the selected domain callout and animate to the region
  useEffect(() => {
    if (selectedDomain) {
      openMarkerCallout(selectedDomain);
      const point = OpenLocationCode.decode(selectedDomain) as any;
      animateToRegion(point.latitudeCenter, point.longitudeCenter, 20);
    }
  }, [selectedDomain]);

  // useEffect to handle open the view domain callout and animate to the region
  useEffect(() => {
    if (viewDomain && domainsArray.data?.includes(viewDomain)) {
      animateToRegionOnFlashListClick(viewDomain);
    }
  }, [viewDomain]);

  // Function to open the marker callout
  function openMarkerCallout(domain: string) {
    const marker = markerRef.current.get(domain);
    marker?.showCallout();
  }

  // Function to handle on focus domain card
  function onFocusDomainCard(domain: string) {
    setFocusedDomainCard(domain);
    openMarkerCallout(domain);
  }

  // Function to animate the map to a specific region on flashList item click
  function animateToRegionOnFlashListClick(domain: string) {
    const point = OpenLocationCode.decode(domain) as any;
    animateToRegion(point.latitudeCenter, point.longitudeCenter, 20);
    onFocusDomainCard(domain);
  }

  // Function to animate the map to a specific region
  function animateToRegion(
    latitude: number,
    longitude: number,
    zoomTo?: number
  ) {
    const { latitudeDelta, longitudeDelta } = zoomToDelta(zoomTo ?? zoom);
    let region = {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: latitudeDelta,
      longitudeDelta: longitudeDelta,
    };
    mapRef.current?.animateToRegion(region, 1000);
  }

  // Function to get initial region based on the location if available
  function getInitialRegion() {
    if (location && locationPermission) {
      const { latitudeDelta, longitudeDelta } = zoomToDelta(18);
      let region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: latitudeDelta,
        longitudeDelta: longitudeDelta,
      };
      return region;
    }
    return region;
  }

  // Function to get the closest marker to the center of the map
  const processClosestMarker = (region: Region, domainsInView: any[]) => {
    if (domainsInView.length === 0) {
      return;
    }
    let closestItem = domainsInView[0].properties.identifier;
    let minDistance = Infinity;
    domainsInView.forEach((item: any) => {
      const distance = Math.sqrt(
        Math.pow(region.latitude - item.geometry.coordinates[1], 2) +
          Math.pow(region.longitude - item.geometry.coordinates[0], 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestItem = item.properties.identifier;
      }
    });
    setClosestDomain(closestItem);
    if (selectedDomain && selectedDomain === closestItem) {
      openMarkerCallout(selectedDomain);
      return;
    }
    onFocusDomainCard(closestItem);
  };

  // Function to recursively process the items in view
  const processItem = (item: any, domainsInView: any[]) => {
    if (item.properties.cluster) {
      const children = superClusterRef.current.getChildren(
        item.properties.cluster_id
      );
      children.forEach((child: any) => {
        processItem(child, domainsInView);
      });
    } else {
      domainsInView.push(item);
    }
  };

  // Function to process the items in view and set the domainsInView state
  const processItemsInView = (region: Region) => {
    const zoom = calculateZoom(region);
    const itemsInView = superClusterRef.current.getClusters(
      [
        region.longitude - region.longitudeDelta / 2,
        region.latitude - region.latitudeDelta / 2,
        region.longitude + region.longitudeDelta / 2,
        region.latitude + region.latitudeDelta / 2,
      ],
      zoom
    );
    const domainsInView: any[] = [];
    itemsInView.forEach((item: any) => {
      processItem(item, domainsInView);
    });
    setDomainsInViewport(
      domainsInView.map((item) => item.properties.identifier)
    );
    processClosestMarker(region, domainsInView);
  };

  // Function to handle region change
  function onRegionChange(region: Region) {
    setRegion(region);
    handleZoomChange(region);
    processItemsInView(region);
  }

  // Function to handle map ready
  function onMapReady() {
    setMapLoading(false);
    handleZoomChange(region);
    processItemsInView(region);
  }

  // Function to handle closing the marker callout
  function handleCalloutPress(domain: string, isOwned: boolean) {
    const marker = markerRef.current.get(domain);
    marker?.hideCallout();
  }

  // Function to handle on marker press
  function handleMarkerPress(
    latitude: number,
    longitude: number,
    domain: string,
    isOwned: boolean
  ) {
    animateToRegion(latitude, longitude, 20);
    isOwned && onFocusDomainCard(domain);
  }

  // Function to get owned markers and polygons based on the domain
  function getOwnedMarkersAndPolygons() {
    const markers: JSX.Element[] = [];
    const polygons: JSX.Element[] = [];
    domainsArray.data?.map((domain) => {
      const point = OpenLocationCode.decode(domain) as any;
      markers.push(MapMarkerComponent({ domain, isOwned: true, point }));
      polygons.push(MarkerPolygonComponent({ domain, isOwned: true, point }));
    });
    return { markers, polygons };
  }

  // Function to get the selected marker and polygon based on the domain
  function getSelectedMarkerAndPolygon() {
    if (!selectedDomain) {
      return { marker: null, polygon: null };
    }
    const point = OpenLocationCode.decode(selectedDomain) as any;
    const selectedMarker = MapMarkerComponent({
      domain: selectedDomain,
      isOwned: false,
      point,
    });
    const selectedPolygon = MarkerPolygonComponent({
      domain: selectedDomain,
      isOwned: false,
      point,
    });
    return { selectedMarker, selectedPolygon };
  }

  // Create Map Marker and Polygon components based on the domain
  const MapMarkerComponent = ({
    domain,
    isOwned,
    point,
  }: {
    domain: string;
    isOwned: boolean;
    point: any;
  }) => {
    const owned = isOwned ? "domain" : "selection";
    const latitude = point.latitudeCenter;
    const longitude = point.longitudeCenter;
    return (
      <Marker
        key={`marker-${owned}-${domain}`}
        identifier={domain}
        coordinate={{ latitude, longitude }}
        onPress={() => handleMarkerPress(latitude, longitude, domain, isOwned)}
        ref={(el) => markerRef.current.set(domain, el)}
        image={
          isOwned
            ? require("@/assets/markers/map-marker.png")
            : require("@/assets/markers/map-marker-square-plus.png")
        }
      >
        <Callout tooltip onPress={() => handleCalloutPress(domain, isOwned)}>
          <YStack gap="$2" bg={"$backgroundFocus"} p={"$2"} br={"$5"} mb={20}>
            <ThemedText type="default">{domain}</ThemedText>
            <Separator />
            {isOwned ? (
              <XStack>
                <LucideIcon defaultIcon="viewDomain" />
                <ThemedText type="subtitle"> View </ThemedText>
                <LucideIcon defaultIcon="arrowRight" />
              </XStack>
            ) : (
              <XStack>
                <LucideIcon defaultIcon="buy" />
                <ThemedText type="subtitle"> Buy </ThemedText>
                <LucideIcon defaultIcon="arrowRight" />
              </XStack>
            )}
            <ViewArrow color={theme.backgroundFocus.get()} />
          </YStack>
        </Callout>
      </Marker>
    );
  };

  // Create Marker Polygon component based on the domain
  const MarkerPolygonComponent = ({
    domain,
    isOwned,
    point,
  }: {
    domain: string;
    isOwned: boolean;
    point: any;
  }) => {
    const owned = isOwned ? "domain" : "selection";
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
      .replace(/[^,]+(?=\))/, "0.8");
    const opaqueColor10 = theme.color10.get().replace(/[^,]+(?=\))/, "0.8");
    return (
      <Polygon
        key={`polygon-${owned}-${domain}`}
        coordinates={[northEast, southEast, southWest, northWest]}
        strokeColor={isOwned ? opaqueAccentColor : opaqueColor10}
        fillColor={isOwned ? opaqueColor10 : opaqueAccentColor}
        strokeWidth={1}
      />
    );
  };

  // Get the selected marker and polygon
  const { selectedMarker, selectedPolygon } = getSelectedMarkerAndPolygon();

  // MapView component with UrlTile, Marker, and Polygon components
  return (
    <YStack f={1} ov={"hidden"} borderRadius={"$6"} m={"$3"}>
      <MapView
        ref={mapRef}
        superClusterRef={superClusterRef}
        onMapReady={onMapReady}
        onPress={(e) => handleOnMapPress(e.nativeEvent.coordinate)}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        mapType={MAP_TYPES.STANDARD}
        initialRegion={getInitialRegion()}
        onRegionChangeComplete={onRegionChange}
        showsUserLocation={locationPermission}
        followsUserLocation
        loadingEnabled
        loadingIndicatorColor={theme.color9.get()}
      >
        <UrlTile
          urlTemplate="https://grid.plus.codes/grid/wms/{z}/{x}/{y}.png"
          zIndex={-1}
        />
        {ownedMarkers}
        {ownedPolygons}
        {selectedMarker}
        {selectedPolygon}
      </MapView>
      <View
        f={1}
        key={"domain-flashlist"}
        pos={"absolute"}
        b={1}
        mih={100}
        mb={55}
      >
        <MapDomainFlashList
          address={account?.address}
          domains={domainsArray.data ? [...domainsArray.data.slice()] : []}
          focusedDomainCard={focusedDomainCard}
          onFocusClick={animateToRegionOnFlashListClick}
        />
      </View>
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
