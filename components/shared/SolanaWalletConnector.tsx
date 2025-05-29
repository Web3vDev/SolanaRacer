"use client";

import { FC, useCallback, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { sdk } from "@farcaster/frame-sdk";

interface SolanaWalletConnectorProps {
  className?: string;
}

export const SolanaWalletConnector: FC<SolanaWalletConnectorProps> = ({ className }) => {
  const { publicKey, wallet, disconnect, connecting } = useWallet();
  const { setVisible } = useWalletModal();
  const [showWalletAddress, setShowWalletAddress] = useState(false);

  // Handle Solana wallet connection
  const handleConnect = useCallback(async () => {
    if (!wallet) {
      try {
        // Hiển thị modal chọn ví thay vì gọi connect() trực tiếp
        console.log("Opening wallet selection modal");
        setVisible(true);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      // Toggle wallet address display if already connected
      setShowWalletAddress(!showWalletAddress);
    }
  }, [wallet, setVisible, showWalletAddress]);

  // Handle disconnect
  const handleDisconnect = useCallback(() => {
    if (disconnect) {
      disconnect();
      setShowWalletAddress(false);
    }
  }, [disconnect]);

  // Format wallet address for display
  const formattedAddress = publicKey
    ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`
    : "";

  useEffect(() => {
    // Initialize Farcaster SDK
    try {
      sdk.actions.ready({});
    } catch (error) {
      console.warn("Error initializing Farcaster SDK:", error);
    }
  }, []);

  return (
    <div>
      {!publicKey ? (
        <Button
          onClick={handleConnect}
          disabled={connecting}
          className={`h-10 bg-gradient-to-r from-zinc-900 to-zinc-800 hover:from-zinc-800 hover:to-zinc-700 text-white text-xs font-medium rounded-l-full rounded-r-none border border-zinc-700 flex items-center gap-1.5 transition-all duration-300 pr-4 pl-3 ${className}`}
        >
          <Wallet className="h-3.5 w-3.5" />
          {connecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowWalletAddress(!showWalletAddress)}
            className={`h-10 bg-gradient-to-r from-zinc-900 to-zinc-800 hover:from-zinc-800 hover:to-zinc-700 text-white text-xs font-medium rounded-l-full rounded-r-none border border-zinc-700 flex items-center gap-1.5 transition-all duration-300 ${
              showWalletAddress ? "pr-4 pl-3" : "pr-3 pl-3"
            } ${className}`}
          >
            <Wallet className="h-3.5 w-3.5" />
            {showWalletAddress ? formattedAddress : ""}
          </Button>
        </div>
      )}
    </div>
  );
};
