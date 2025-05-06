import { ExpoConfig, ConfigContext } from "@expo/config";
import * as dotenv from "dotenv";

// initialize dotenv
dotenv.config();

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Tangiblink",
  slug: "Tangiblink",
  ios: {
    config: {
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY_IOS,
    },
  },
  android: {
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY_ANDROID,
      },
    },
  },
});
