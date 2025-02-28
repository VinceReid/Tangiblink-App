import { Popup } from "react-native-map-link";
import { BackHandler } from "react-native";
import { useEffect } from "react";
import { router } from "expo-router";
import { useTheme } from "tamagui";
import { useMapDirectionsStore } from "@/store/mapDirectionsStore";
import OpenLocationCode from "@/utils/openlocationcode";

export const MapDirectionsPopUp = () => {
  const theme = useTheme();
  const color = theme.color.get();
  const subTextColor = theme.color10.get();
  const backgroundColor = theme.background.get();
  const modalViewBackgroundColor = theme.color5.get();
  const borderColor = theme.accentColor.get();
  // Destructuring the store
  const mapDirectionsPopUpOpen = useMapDirectionsStore(
    (state) => state.mapDirectionsPopUpOpen
  );
  const setMapDirectionsPopUpOpen = useMapDirectionsStore(
    (state) => state.setMapDirectionsPopUpOpen
  );
  const directToDomain = useMapDirectionsStore((state) => state.directToDomain);
  const point = directToDomain && OpenLocationCode.decode(directToDomain) as any;

  useEffect(() => {
    const onBackPress = () => {
      if (mapDirectionsPopUpOpen) {
        setMapDirectionsPopUpOpen(false);
        return true;
      }
      router.back();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => backHandler.remove();
  }, [mapDirectionsPopUpOpen]);

  return (
    <Popup
      isVisible={mapDirectionsPopUpOpen}
      setIsVisible={setMapDirectionsPopUpOpen}
      onCancelPressed={() => setMapDirectionsPopUpOpen(false)}
      onAppPressed={() => setMapDirectionsPopUpOpen(false)}
      modalProps={{
        // you can put all modal props inside.
        animationType: "fade",
      }}
      options={{
        /* See `showLocation` method above, this accepts the same options. */
        latitude: point.latitudeCenter,
        longitude: point.longitudeCenter,
        title: directToDomain,
        googleForceLatLon: true, // optionally force GoogleMaps to use the latlon for the query instead of the title
        dialogTitle: `Directions to ${directToDomain} in Maps`, // optional (default: 'Open in Maps')
      }}
      style={{
        /* Optional: you can override default style by passing your values. */
        cancelButtonContainer: {
          padding: 10,
          borderRadius: 10,
          borderColor: borderColor,
          borderWidth: 1,
        },
        cancelButtonText: {
          color: color,
          textAlign: "center",
        },
        container: {
          backgroundColor: backgroundColor,
        },
        modalView: {
          backgroundColor: modalViewBackgroundColor,
        },
        titleText: {
          color: color,
        },
        subtitleText: {
          color: subTextColor,
        },
        itemText: {
          color: color,
        },
        separatorStyle: {
          height: 1,
          backgroundColor: borderColor,
        },
      }}
    />
  );
};
