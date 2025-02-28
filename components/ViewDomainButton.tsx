import { LucideIcon } from "@/components/LucideIcons";
import { useRouter } from "expo-router";
import { useMapStore } from "@/store/mapStore";
import { useBuyDomainStore } from "@/store/buyDomainStore";
import { AnimatePresence, Button } from "tamagui";

// Button to open the buy sheet
export const ViewDomainButton = () => {
  const router = useRouter();
  // Destructuring the store
  const buySheetOpen = useBuyDomainStore((state) => state.buySheetOpen);
  const domainsInViewPort = useMapStore((state) => state.domainsInViewport);
  const focusedDomainCard = useMapStore((state) => state.focusedDomainCard);
  const closestDomain = useMapStore((state) => state.closestDomain);
  return (
    <AnimatePresence>
      {focusedDomainCard &&
        !buySheetOpen &&
        domainsInViewPort.includes(focusedDomainCard) &&
        closestDomain === focusedDomainCard && (
          <Button
            key={"view-domain-button-map"}
            pos={"absolute"}
            t={"60%"}
            r={"5%"}
            size={"$5"}
            animation="bouncy"
            circular
            icon={<LucideIcon defaultIcon="viewDomain" size={"$2"} />}
            onPress={() => router && router.navigate(`/${focusedDomainCard}`)}
            enterStyle={{
              opacity: 0,
              x: 50,
              y: 10,
              scale: 0.9,
            }}
            exitStyle={{
              opacity: 0,
              x: 50,
              y: 10,
              scale: 0.9,
            }}
          />
        )}
    </AnimatePresence>
  );
};
