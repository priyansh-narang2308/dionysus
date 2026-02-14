import "@/styles/globals.css";

import { type Metadata } from "next";
import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Dionysus",
  description: "Github Analyzer",
  icons: {
    icon: "/icon.png"
  }
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "600", "500", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${poppins.className}`}>
        <body suppressHydrationWarning>
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <Toaster richColors position="bottom-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
