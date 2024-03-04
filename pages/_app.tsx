import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
//import { arbitrum, baseGoerli } from 'wagmi/chains';
import { Chain } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { ChakraProvider } from '@chakra-ui/react'
import theme from '../styles/styles/theme'


/*
 const ganache:Chain ={
   id: 1337,
   network: "ganache",
   name: "ganache",
   nativeCurrency: {
       name: "Ethereum",
       symbol: "ETH",
       decimals: 18,
  },
   rpcUrls: {
       default: {
           http:  ["HTTP://127.0.0.1:7545"],
      },
       public: {
           http:  ["HTTP://127.0.0.1:7545"],
      },
  },

   testnet: true,
}
*/
const baseSepolia:Chain ={
  id: 84532,
  network: "base-sepolia",
  name: "Base Sepolia",
  nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
 },
  rpcUrls: {
      default: {
          http:  ["https://sepolia.base.org"],
     },
      public: {
          http:  ["https://sepolia.base.org"],
     },
 },
  blockExplorers: {
   etherscan: {
       name: "Basescan",
       url: "https://base-sepolia.blockscout.com",
  },
   default: {
       name: "Basescan",
       url: "https://base-sepolia.blockscout.com",
  },
},

  testnet: true,
}

const { chains, provider, webSocketProvider } = configureChains(
  [

    baseSepolia
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider  coolMode modalSize={'compact'} chains={chains} initialChain={84532} theme={darkTheme()} >
          <ChakraProvider theme={theme}>
            <Component {...pageProps} />
          </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
