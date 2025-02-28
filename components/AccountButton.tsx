import { useRouter, usePathname } from "expo-router";
import { ThemedButton } from "@/components/ThemedButton";
import { useActiveAccount } from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";

export function AccountButton() {
  const account = useActiveAccount();
  const router = useRouter();
  const pathname = usePathname();
  return (
    (pathname !== "/" || account) && (
      <ThemedButton
        onPress={() => pathname !== "/" && router && router.navigate("/(tabs)/")}
        title={account ? shortenAddress(account.address) : "Log in"}
        size="small"
      />
    )
  );
}
