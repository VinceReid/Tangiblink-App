import { Redirect } from "expo-router";
import { useAppSettings } from "@/store/settingsStore";

export default function IndexPage() {
  const onboarding = useAppSettings((state) => state.onboarding);
  if (!onboarding) {
    return <Redirect href="/onboarding" />;
  } else {
    return <Redirect href="/(tabs)" />;
  }
}
