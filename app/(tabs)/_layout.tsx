import { Link, Tabs } from "expo-router";
import { useTheme, XStack } from "tamagui";
import { SettingsButton } from "@/components/SettingsButton";
import { AccountButton } from "@/components/AccountButton";
import { Image, StyleSheet } from "react-native";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";

export default function TabLayout() {
  const theme = useTheme();
  const tabBarColor = theme.background.get();
  const activeColor = theme.color10.get();
  const inactiveColor = theme.accentColor.get();
  const fontColor = theme.color.get();

  return (
    <Tabs
      screenOptions={{
        headerTransparent: true,
        headerTitleAlign: "left",
        headerTitleStyle: { color: fontColor },
        tabBarStyle: { backgroundColor: tabBarColor, borderTopWidth: 0.5 },
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        headerLeft: () => (
          <Image
            source={require("@/assets/images/appHeaderLeft.png")}
            style={styles.headerLogo}
          />
        ),
        headerRight: () => (
          <XStack flex={1} alignItems="center">
            <AccountButton />
            <Link href="/settings" asChild>
              <SettingsButton />
            </Link>
          </XStack>
        ),
        headerLeftContainerStyle: { marginLeft: 10 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => (
            <TabBarIcon defaultIcon={"account"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
          tabBarIcon: ({ color }) => (
            <TabBarIcon defaultIcon={"activity"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ color }) => (
            <TabBarIcon defaultIcon={"map"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => (
            <TabBarIcon defaultIcon={"search"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan",
          tabBarIcon: ({ color }) => (
            <TabBarIcon defaultIcon={"scan"} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerLogo: {
    height: 28,
    width: 28,
    left: 10,
  },
});
