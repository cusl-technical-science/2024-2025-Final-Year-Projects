import { ToastProvider } from " @/provider/toast-provider";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";



const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "GetJob",
  description: "Get Job in a Convinient way!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <ClerkProvider>
      <html lang="en">
        <body className={poppins.className}>
          {children}
          <ToastProvider />
        </body>
      </html>
    </ClerkProvider>
  );
}
