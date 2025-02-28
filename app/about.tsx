import { Stack } from "expo-router";
import { Container } from "@/components/Container";
import { useTheme, YStack, XStack, Image } from "tamagui";
import { ThemedText } from "@/components/ThemedText";
import { ExternalLink } from "@/components/ExternalLink";
import { twitter } from "@/constants/externalLinks";
import { ParallaxScrollView } from "@/components/ParallaxScrollView";
import { StyleSheet } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export default function About() {
  const theme = useTheme();
  const color = theme.color.get();
  const accentColor = theme.accentColor.get();
  const headerImage = require("@/assets/images/headerNoBackground.png");

  return (
    <Container>
      <Stack.Screen
        options={{
          title: "About",
          headerShown: true,
          headerTransparent: true,
          headerTitleAlign: "center",
          headerTitleStyle: { color: color },
          headerTintColor: color,
        }}
      />
      <ParallaxScrollView
        headerImage={<Image source={headerImage} style={styles.reactLogo} />}
      >
        <YStack gap="$2">
          <ThemedText>
            {`Tangiblink Domains provide a way to link a wallet to a location. 
            \nDomain owners can receive payments to their domain.
            \nUsing a domain provides an extra layer of trust.
            \nPayees can be sure they are sending crypto payments to the right place.
            \nDomain owners can set records within the domain to provide more information about the location, or for any other purpose.`}
          </ThemedText>
          <ThemedText>
            Its a simple idea that can be used in many ways. I hope you find it
            useful in some way...
          </ThemedText>
          <ThemedText>
            Let me know if you have any feedback or suggestions. Thanks for using Tangiblink!
          </ThemedText>
          <YStack gap="$4">
            <ThemedText>Connect with us on social media:</ThemedText>
            <XStack gap="$1" justifyContent="space-evenly">
              <ExternalLink href={twitter}>
                <FontAwesome6 name="x-twitter" size={48} color={accentColor} />
              </ExternalLink>
            </XStack>
          </YStack>
        </YStack>
      </ParallaxScrollView>
    </Container>
  );
}
const styles = StyleSheet.create({
  reactLogo: {
    height: "100%",
    width: "100%",
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
