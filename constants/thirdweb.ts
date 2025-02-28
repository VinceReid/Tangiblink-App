import { createThirdwebClient, getContract } from "thirdweb";
import { getRpcClient } from "thirdweb/rpc";
import { ethereum, polygon, sepolia } from "thirdweb/chains";
import { inAppWallet } from "thirdweb/wallets/in-app";
import { createWallet } from "thirdweb/wallets";
import { darkTheme } from "thirdweb/react";
import { useTheme } from "tamagui";

const clientId = process.env.EXPO_PUBLIC_THIRDWEB_CLIENT_ID!;

export const getChain = () => {
  switch (process.env.EXPO_PUBLIC_CHAIN) {
    case "ethereum":
      return ethereum;
    case "polygon":
      return polygon;
    case "sepolia":
      return sepolia;
    default:
      return polygon;
  }
};

export const chain = getChain();

const blockExplorers = chain.blockExplorers;

console.log({chain, blockExplorers});

if (!clientId) {
  throw new Error(
    "Missing EXPO_PUBLIC_THIRDWEB_CLIENT_ID - make sure to set it in your .env file"
  );
}

export const client = createThirdwebClient({
  clientId,
});

export const contract = getContract({
  client,
  address: process.env.EXPO_PUBLIC_DOMAIN_REGISTRY_CONTRACT_ADDRESS!,
  chain,
});

export const usdcContract = getContract({
  address: "0x694aa1769357215de4fac081bf1f309adc325306",
  chain,
  client,
});

export const rpcRequest = getRpcClient({ client, chain });

const appMetadata = {
  name: "Tangiblink",
  url: "https://tangiblink.io",
  description: "Tangiblink - payments by domain location.",
  logoUrl: "https://tangiblink.io/favicon.ico",
};

export const openSeaUrl = `${process.env.EXPO_PUBLIC_OPENSEA_URL!}/${
  contract.address
}/`;

export const wallets = [
  inAppWallet({
    auth: {
      options: [
        "google",
        "facebook",
        "discord",
        "telegram",
        "email",
        "phone",
        "passkey",
      ],
    },
    smartAccount: {
      chain: chain,
      sponsorGas: true,
    },
    metadata: {
      image: require("@/assets/images/appHeaderLeft.png"),
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet", {
    appMetadata: appMetadata,
    mobileConfig: {
      callbackURL: "io.tangiblink.app",
    },
    walletConfig: {
      options: "smartWalletOnly",
    },
  }),
  createWallet("me.rainbow"),
  createWallet("com.trustwallet.app"),
  createWallet("io.zerion.wallet"),
  createWallet("xyz.argent"),
  createWallet("com.okex.wallet"),
  createWallet("com.zengo"),
];

export function getConnectTheme() {
  const theme = useTheme();
  const buttonColor = theme.color5.get();
  const bg = theme.background.get();
  const primary = theme.color.get();
  const secondaryColor = theme.accentColor.get();
  const secondaryText = theme.color10.get();
  const buttonBg = theme.accentBackground.get();
  const secondaryButtonBg = theme.color10.get();
  const borderColor = theme.borderColor.get();
  const connectStyle = {
    colors: {
      connectedButtonBg: buttonColor,
      primaryButtonText: primary,
      primaryButtonBg: buttonColor,
      modalBg: bg,
      borderColor: borderColor,
      accentButtonBg: buttonBg,
      primaryText: primary,
      secondaryIconColor: secondaryColor,
      secondaryText: secondaryText,
      secondaryButtonBg: secondaryButtonBg,
    },
  };
  const connectTheme = darkTheme(connectStyle);

  return connectTheme;
}
