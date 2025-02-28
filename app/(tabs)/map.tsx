import { Container } from "@/components/Container";
import MapContent from "@/components/MapContent";
import { BuySheetOpenButton } from "@/components/BuySheetOpenButton";
import { ViewDomainButton } from "@/components/ViewDomainButton";
import { DomainFlashListButton } from "@/components/DomainFlashListButton";
import LocationPermissionRequest from "@/components/LocationPermissionRequest";

export default function MapScreen() {
  return (
    <Container>
      <MapContent />
      <BuySheetOpenButton />
      <ViewDomainButton />
      <DomainFlashListButton />
      <LocationPermissionRequest />
    </Container>
  );
}
