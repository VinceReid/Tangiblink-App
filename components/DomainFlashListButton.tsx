import { LucideIcon } from "@/components/LucideIcons";
import { useMapStore } from "@/store/mapStore";
import { useControllableState, useEvent, Circle } from "tamagui";
import { Dimensions } from "react-native";
import { useEffect, useRef, useState } from "react";

// Button to open the domain card flash list
export const DomainFlashListButton = () => {
  // Destructuring the store
  const domainFlashListOpen = useMapStore((state) => state.domainFlashListOpen);
  const setDomainFlashListOpen = useMapStore(
    (state) => state.setDomainFlashListOpen
  );
  // Get the window size
  const windowWidth = Dimensions.get("window").width;

  const viewRef = useRef<any>(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!viewRef.current || !isLayoutReady) return;
    viewRef?.current?.measure((x: number, y: number, width: number) => {
      setWidth(width);
    });
  }, [viewRef, isLayoutReady]);

  const [positionI, setPositionI] = useControllableState({
    strategy: "most-recent-wins",
    prop: domainFlashListOpen ? 0 : 1,
    defaultProp: 0,
  });
  const position = positions[positionI];

  const onPress = useEvent(() => {
    setDomainFlashListOpen();
    setPositionI((x) => {
      return (x + 1) % positions.length;
    });
  });

  return (
    <Circle
      key={"domain-flashlist-button"}
      ref={viewRef}
      onLayout={() => setIsLayoutReady(true)}
      animateOnly={["transform"]}
      backgroundColor="$color4"
      pos={"absolute"}
      b={15}
      r={windowWidth / 2 - width / 2}
      size={"$5"}
      animation="bouncy"
      onPress={onPress}
      theme="active"
      pressStyle={{ scale: 0.9 }}
      hoverStyle={{ scale: 0.9 }}
      scale={1}
      {...position}
    >
      <LucideIcon defaultIcon="down" size={"$2"} />
    </Circle>
  );
};

// The positions of the button
export const positions = [
  {
    rotate: "0deg",
  },
  {
    rotate: "180deg",
  },
];
