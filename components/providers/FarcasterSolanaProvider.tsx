"use client";

import React, { FC, ReactNode } from "react";
import { FarcasterSolanaProvider as FarcasterSolanaProviderCore } from "@farcaster/mini-app-solana";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";

// Ensure the Farcaster Solana wallet registers with Wallet Standard
import "@farcaster/mini-app-solana";

interface FarcasterSolanaProviderProps {
  children: ReactNode;
  network?: WalletAdapterNetwork;
  endpoint?: string;
}

export const FarcasterSolanaProvider: FC<FarcasterSolanaProviderProps> = ({
  children,
  network = WalletAdapterNetwork.Devnet,
  endpoint,
}) => {
  // Use provided endpoint or default to cluster API URL
  const rpcEndpoint = endpoint || clusterApiUrl(network);

  return (
    <FarcasterSolanaProviderCore endpoint={rpcEndpoint}>
      {children}
    </FarcasterSolanaProviderCore>
  );
};
