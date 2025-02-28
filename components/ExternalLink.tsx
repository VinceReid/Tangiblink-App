import { Link } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import type { ComponentProps } from "react";
import { Platform } from "react-native";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href as any}
      onPress={async (event) => {
        if (Platform.OS !== "web") {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          await openBrowserAsync(href);
        }
      }}
    />
  );
}

// This function is used to open external links in an in-app browser on native platforms and in the default browser on the web.
export function ExternalLinkOnPress(href: string) {
  if (Platform.OS !== "web") {
    // Open the link in an in-app browser.
    openBrowserAsync(href);
  } else {
    // Open the link in the default browser.
    window.open(href, "_blank");
  }
}
