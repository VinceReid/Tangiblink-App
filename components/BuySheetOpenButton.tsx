import { LucideIcon } from "@/components/LucideIcons";
import { useMapStore } from "@/store/mapStore";
import { useBuyDomainStore } from "@/store/buyDomainStore";
import { AnimatePresence, Button } from "tamagui";

// Button to open the buy sheet
export const BuySheetOpenButton = () => {
  // Destructuring the store
  const selectedDomain = useMapStore((state) => state.selectedDomain);
  const buySheetOpen = useBuyDomainStore((state) => state.buySheetOpen);
  const setBuyDomain = useBuyDomainStore((state) => state.setBuyDomain);
  const domainsInViewPort = useMapStore((state) => state.domainsInViewport);
  const setBuySheetOpen = useBuyDomainStore((state) => state.setBuySheetOpen);
  function onPress() {
    if (!selectedDomain) return;
    setBuyDomain(selectedDomain);
    setBuySheetOpen(true);
  }
  return (
    <AnimatePresence>
      {selectedDomain &&
        !buySheetOpen &&
        domainsInViewPort.includes(selectedDomain) && (
          <Button
            key={"buy-button"}
            pos={"absolute"}
            t={"50%"}
            r={"5%"}
            size={"$5"}
            animation="bouncy"
            circular
            icon={<LucideIcon defaultIcon="buy" size={"$2"} />}
            onPress={() => onPress()}
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
