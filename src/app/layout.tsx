import SessionProviderWrapper from "@/providers/sessionProvider";
import type { Metadata } from "next";
import "./globals.css";

import { Poppins } from "next/font/google";

import ConditionalLayout from "@/components/common/ConditionalLayout"

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // You can specify multiple weights here
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Wellness App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <SessionProviderWrapper>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
