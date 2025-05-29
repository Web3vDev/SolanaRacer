import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { FarcasterContextProvider } from "@/contexts/farcaster-context-provider"
import { FarcasterSolanaProvider } from "@/components/providers/FarcasterSolanaProvider"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  // title: "v0 App",
  // description: "Created with v0",
  // generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <FarcasterContextProvider>
            <FarcasterSolanaProvider network={WalletAdapterNetwork.Devnet}>
              {children}
              {/* Modal portal được đặt trong page.tsx */}
            </FarcasterSolanaProvider>
          </FarcasterContextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
