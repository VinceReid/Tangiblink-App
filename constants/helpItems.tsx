import { Link } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { YStack, Separator } from "tamagui";
import { LucideIcon } from "@/components/LucideIcons";

interface HelpItem {
  title: string;
  info: JSX.Element;
  link?: string;
}

export const HelpItems: HelpItem[] = [
  {
    title: "Getting Started",
    info: (
      <YStack gap="$1">
        <LucideIcon defaultIcon="account" size={"$1"} />
        <ThemedText>
          Head to{" "}
          <Link href="/(tabs)/" asChild>
            <ThemedText type="link">Account</ThemedText>
          </Link>{" "}
          to connect your wallet or create a new one using email and password or
          social login e.g. Google.
        </ThemedText>
        <LucideIcon defaultIcon="wallet" size={"$1"} />
        <ThemedText>
          Once connected select your wallet and fund your account with a credit
          card or cryptocurrency. You will need to have a balance to purchase a
          domain. Each domain cost the equivalent of $0.5 USD in Polygon
          blockchain network cryptocurrency 'POL'.
        </ThemedText>
        <ThemedText>
          Optionally you can move to the next step and purchase a domain without
          funding your account first. You will be prompted to fund your account
          before the transaction is confirmed.
        </ThemedText>
        <Separator />
        <LucideIcon defaultIcon="map" size={"$1"} />
        <ThemedText>
          Head to the{" "}
          <Link href="/(tabs)/map" asChild>
            <ThemedText type="link">Map</ThemedText>
          </Link>{" "}
          to select your desired location for your domain.
        </ThemedText>
        <Separator />
        <LucideIcon defaultIcon="buy" size={"$1"} />
        <ThemedText>
          Once selected, click the purchase button. You will be prompted to sign
          a transaction in your wallet. Once the transaction is confirmed, the
          domain will be added to your account.
        </ThemedText>
      </YStack>
    ),
  },
  {
    title: "Domain Management",
    info: (
      <YStack gap="$1">
        <LucideIcon defaultIcon="account" size={"$1"} />
        <ThemedText>
          Manage your domains in{" "}
          <Link href="/(tabs)/" asChild>
            <ThemedText type="link">Account</ThemedText>
          </Link>{" "}
          .
        </ThemedText>
        <ThemedText>
          Here you can view all your domains, transfer them to another account,
          add or edit records, and more.
        </ThemedText>
        <Separator />
        <LucideIcon defaultIcon="transferDomain" size={"$1"} />
        <ThemedText>
          Transfer a domain to another account by clicking the transfer icon.
          You will need the recipient's wallet address.
        </ThemedText>
        <Separator />
        <LucideIcon defaultIcon="records" size={"$1"} />
        <ThemedText>
          View all records associated with a domain by clicking the records
          icon. Here you can view, edit, or delete records.
        </ThemedText>
        <ThemedText>
          Records are used to store information such as IPFS hashes, email
          addresses, and more. Theoretically any data can be stored in a record
          only limited by the size of the data that does not exceed the gas
          limit of the blockchain transaction.
        </ThemedText>
        <ThemedText type="subtext">
          To save new, deleted or edited records, you will need to sign a
          transaction in your wallet. This will cost a small amount of 'POL'
          cryptocurrency to cover the cost of the transaction.
        </ThemedText>
        <Separator />
        <LucideIcon defaultIcon="addRecord" size={"$1"} />
        <ThemedText>
          Add a record to a domain by clicking the add record icon. You will
          need to provide a key and value for the record.
        </ThemedText>
        <ThemedText>
          The key is a unique identifier for the record. The value is the data
          to be stored.
        </ThemedText>
        <Separator />
        <LucideIcon defaultIcon="editRecord" size={"$1"} />
        <ThemedText>
          Edit a record by clicking the edit record icon. You will need to
          provide the new value for the record.
        </ThemedText>
        <Separator />
        <LucideIcon defaultIcon="loanDomain" size={"$1"} />
        <ThemedText>
          Loan a domain to another account by clicking the loan icon. You will
          need the recipient's wallet address and the duration of the loan.
        </ThemedText>
        <ThemedText type="subtext">
          To confirm the loan, you will need to sign a transaction in your
          wallet. This will cost a small amount of 'POL' cryptocurrency to cover
          the cost of the transaction.
        </ThemedText>
        <ThemedText>
          The recipient will be able to manage the domain during the loan
          period. Once the loan period expires, the domain will be returned to
          your account.
        </ThemedText>
        <ThemedText>
          The recipient will not be able to transfer the domain to another
          account during the loan period.
        </ThemedText>
        <ThemedText type="subtext">
          Any payments made to the domain during the loan period will be
          credited to the recipient's account.
        </ThemedText>
        <ThemedText>
          You can cancel the loan at any time by loaning the domain back to
          yourself.
        </ThemedText>
        <Separator />
        <LucideIcon defaultIcon="history" size={"$1"} />
        <ThemedText>
          View the history of a domain by clicking the history icon. Here you
          can view all transactions associated with the domain.
        </ThemedText>
      </YStack>
    ),
  },
  {
    title: "Navigation",
    info: (
      <YStack gap="$1">
        <LucideIcon defaultIcon="settings" size={"$1"} />
        <ThemedText>
          Access the settings menu by clicking the settings icon in the top
          right corner of the screen.
        </ThemedText>
        <Separator />
        <LucideIcon defaultIcon="activity" size={"$1"} />
        <ThemedText>
          View recent activity log by clicking the activity icon. Here you can
          view recent transactions and domains purchased by all users.
        </ThemedText>
        <Separator />
        <LucideIcon defaultIcon="account" size={"$1"} />
        <ThemedText>
          View your account details by clicking the account icon. Here you can
          view your wallet address, balance, and owned domains.
        </ThemedText>
        <Separator />
        <LucideIcon defaultIcon="map" size={"$1"} />
        <ThemedText>
          View the map by clicking the map icon. Here you can view all owned
          domains and select your desired location for your domain.
        </ThemedText>
        <Separator />
        <LucideIcon defaultIcon="search" size={"$1"} />
        <ThemedText>
          Search for a domain by clicking the search icon. Here you can search
          for a domain by name or wallet address.
        </ThemedText>
        <Separator />
        <LucideIcon defaultIcon="scan" size={"$1"} />
        <ThemedText>
          Scan a QR code by clicking the scan icon. Here you can scan a QR code
          to view a domain.
        </ThemedText>
        <Separator />
        <LucideIcon defaultIcon="qrCode" size={"$1"} />
        <ThemedText>
          Generate a QR code for a domain by clicking the QR code icon. Here you
          can generate a QR code for a domain to share with others.
        </ThemedText>
        <Separator />
        <LucideIcon defaultIcon="share" size={"$1"} />
        <ThemedText>
          Share a domain by clicking the share icon. Here you can share a domain
          with others using a link.
        </ThemedText>
        <Separator />
        <LucideIcon defaultIcon="copy" size={"$1"} />
        <ThemedText>
          Copy a domain by clicking the copy icon. Here you can copy a domain to
          your clipboard.
        </ThemedText>
        <Separator />
        <LucideIcon defaultIcon="paste" size={"$1"} />
        <ThemedText>
          Paste a domain by clicking the paste icon. Here you can paste a domain
          from your clipboard.
        </ThemedText>
      </YStack>
    ),
  },
  {
    title: "Domain actions",
    info: (
      <YStack gap="$1">
        <LucideIcon defaultIcon="qrCode" size={"$1"} />
        <ThemedText>
          Generate a QR code for a domain by clicking the QR code icon. Here you
          can generate a QR code for a domain to share with others.
        </ThemedText>
        <Separator />
        <LucideIcon defaultIcon="share" size={"$1"} />
        <ThemedText>
          Share a domain by clicking the share icon. Here you can share a domain
          with others using a link.
        </ThemedText>
        <Separator />
        <LucideIcon defaultIcon="mapDirections" size={"$1"} />
        <ThemedText>
          Get directions to a domain by clicking the directions icon. Here you
          can get directions to a domain using a map service.
        </ThemedText>
        <Separator />
        <LucideIcon defaultIcon="history" size={"$1"} />
        <ThemedText>
          View the history of a domain by clicking the history icon. Here you
          can view all transactions associated with the domain.
        </ThemedText>
        <Separator />
        <LucideIcon defaultIcon="pay" size={"$1"} />
        <ThemedText>
          Pay a domain by clicking the pay icon. The funds will be credited to
          the domain owner or user loaning the domain.
        </ThemedText>
        <ThemedText type="subtext">
          Tangiblink charges a 1% fee for the transaction, gas fees are covered
          by the user.
        </ThemedText>
        <Separator />
        <LucideIcon defaultIcon="map" size={"$1"} />
        <ThemedText>
          View the domain location by clicking the map icon. Here you can view
          the location of the domain on a map along with other domains.
        </ThemedText>
        <Separator />
        <LucideIcon defaultIcon="records" size={"$1"} />
        <ThemedText>
          View all records associated with a domain by clicking the records
          icon.
        </ThemedText>
      </YStack>
    ),
  },
  {
    title: "Troubleshooting",
    info: (
      <YStack gap="$1">
        <ThemedText>
          Having trouble? Here are some common issues and solutions.
        </ThemedText>
        <Separator />
        <LucideIcon defaultIcon="notFound" size={"$1"} />
        <ThemedText>
          Domain not found? Make sure the domain exists and is spelled
          correctly.
        </ThemedText>
        <Separator />
        <LucideIcon defaultIcon="unauthorized" size={"$1"} />
        <ThemedText>
          Unauthorized? Make sure you are logged in and have the correct
          permissions.
        </ThemedText>
        <Separator />
        <LucideIcon defaultIcon="alert" size={"$1"} />
        <ThemedText>
          Received a transaction error? Sometimes transactions fail due to
          network congestion. Please wait a few minutes as the transaction may
          eventually go through. If the transaction fails, you may need to try
          again later.
        </ThemedText>
        <Separator />
        <LucideIcon defaultIcon="wallet" size={"$1"} />
        <ThemedText>
          Wallet not connected? Head to the account tab and make sure you are
          connected to the correct wallet and have sufficient funds to complete
          the transaction.
        </ThemedText>
        <ThemedText>
          If you are using a hardware wallet, make sure it is connected and
          unlocked.
        </ThemedText>
        <ThemedText>
          If you are using a software wallet, make sure it is connected and
          unlocked.
        </ThemedText>
        <ThemedText>
          If you are using a mobile wallet, make sure you have granted the
          necessary permissions.
        </ThemedText>
        <Separator />
        <LucideIcon defaultIcon="info" size={"$1"} />
        <ThemedText>
          Need more help? Contact support for further assistance.
        </ThemedText>
      </YStack>
    ),
  },
  {
    title: "Contact Support",
    info: (
      <YStack gap="$1">
        <ThemedText>
          Get in touch with our support team for further assistance.
        </ThemedText>
        <Separator />
        <LucideIcon defaultIcon="email" size={"$1"} />
        <ThemedText>
          Email us at{" "}
          <Link href="mailto:support@tangiblink.io">
            <ThemedText type="link">support@tangiblink.io</ThemedText>
          </Link>
        </ThemedText>
      </YStack>
    ),
  },
];
