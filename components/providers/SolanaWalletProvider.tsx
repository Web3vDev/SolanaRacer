"use client";

import { FC, ReactNode, useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
  CloverWalletAdapter,
  LedgerWalletAdapter,
  TorusWalletAdapter,
  TrustWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

interface SolanaWalletProviderProps {
  children: ReactNode;
  network?: WalletAdapterNetwork;
  endpoint?: string;
}

export const SolanaWalletProvider: FC<SolanaWalletProviderProps> = ({
  children,
  network = WalletAdapterNetwork.Devnet,
  endpoint,
}) => {
  // You can also provide a custom RPC endpoint.
  const rpcEndpoint = useMemo(() => endpoint || clusterApiUrl(network), [network, endpoint]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new CloverWalletAdapter(),
      new LedgerWalletAdapter(),
      new TorusWalletAdapter(),
      new TrustWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={rpcEndpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
