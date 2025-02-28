import { ConnectButton, ConnectEmbed } from "thirdweb/react";
import { client, wallets, getConnectTheme, chain } from "@/constants/thirdweb";
import { useToastController } from "@tamagui/toast";

export function ConnectWalletButton() {
  const connectTheme = getConnectTheme();
  const toast = useToastController();

  // On connect function to toast "connected"
  const onConnect = () => {
    toast.show("Connected!", {
      type: "success",
      duration: 5000,
    });
  };

  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      chain={chain}
      theme={connectTheme}
      connectButton={{ label: "Log in" }}
      connectModal={{
        size: "wide",
        title: "Log in",
      }}
      onConnect={onConnect}
    />
  );
}

export function ConnectEmbedComponent() {
  const connectTheme = getConnectTheme();
  return (
    <ConnectEmbed
      client={client}
      wallets={wallets}
      chain={chain}
      theme={connectTheme}
    />
  );
}
