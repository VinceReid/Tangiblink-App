![Banner](https://github.com/VinceReid/Tangiblink-App/raw/main/assets/images/headerNoBackground.png)
# Tangiblink

Tangiblink Domains provide a way to link a wallet to a location, enabling secure and trusted blockchain transactions. With Tangiblink, you can purchase domains, send and receive payments, and explore blockchain features seamlessly. Each domain is a unique NFT on the Polygon blockchain, offering 100% ownership and the ability to trade or sell on platforms like OpenSea.

### Features

- Create wallets using phone number, email, or social logins.
- Sponsor gas fees with smart accounts.
- Connect to external wallets like MetaMask via WalletConnect.
- Automatically reconnect to the last connected wallet on launch.
- Purchase locations directly within the app.
- Pay locations seamlessly using blockchain transactions.
- Read contract state and events.
- Write data to the blockchain.

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/VinceReid/Tangiblink-App.git
cd tangiblink
npm install
```

## Get started

1. Configure environment variables

Rename the `.env.example` file to `.env` and set the required environment variables:

```plaintext
EXPO_PUBLIC_DOMAIN_REGISTRY_CONTRACT_ADDRESS=your_contract_address_here
EXPO_PUBLIC_OPENSEA_URL=your_opensea_url_here
EXPO_PUBLIC_CHAIN=your_chain_here
NODE_ENV=your_node_env_here_eg_development
EXPO_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id_here
EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY_IOS=your_google_cloud_api_key_here
EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY_ANDROID=your_google_cloud_api_key_here
```

2. Prebuild the iOS and Android directories

> [!IMPORTANT]  
> Tangiblink uses native modules, which means it cannot run on Expo GO. You must build the iOS and Android apps to link the native modules.

```bash
npx expo prebuild
```

This will create the `ios` and `android` directories.

3. Start the app

```bash
npm run ios
```

or

```bash
npm run android
```

To run this app, you'll need either:

- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)

## Usage

Once the app is installed and running, you can use the following features:

- **Create Wallet**: Use phone number, email, or social logins to create a wallet.
- **Connect Wallet**: Connect to external wallets like MetaMask via WalletConnect.
- **Auto Connect**: The app will automatically connect to the last connected wallet on launch.
- **Read Contract State**: View the state and events of Tangiblink smart contracts.
- **Write to Blockchain**: Interact with the blockchain by purchasing a location, sending payments, editing owned or loaned location records, loan your locations. 

Explore these features through the app's intuitive interface.

## Troubleshooting

### OpenSSL Error on Xcode 16

If using Xcode 16, you may encounter an OpenSSL error when trying to build the app. To fix this:

- Open the `app.json` file.
- Update the `ios` > `extraPods` section to set `"version": "3.3.2000"` for the `OpenSSL-Universal` pod.
- Save the file and run:

```bash
npx expo prebuild
```

Then try building the app again.

## Additional Resources regarding the use of Thirdweb web3 connect

- [Documentation](https://portal.thirdweb.com/typescript/v5)
- [Templates](https://thirdweb.com/templates)
- [YouTube](https://www.youtube.com/c/thirdweb)

## Thirdweb Support

For help or feedback, please [visit our support site](https://thirdweb.com/support)

## Additional Resources for Tangiblink smart contracts
 - [Tangiblink Contracts Manager](https://github.com/VinceReid/tangiblink-contracts-manager)
