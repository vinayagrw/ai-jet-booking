import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "../components/Footer";
import { Providers } from "./providers";
import { Logger } from "@/components/Logger";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Jet Booking",
  description: "Book your private jet with AI-powered smart search",
};

/**
 * RootLayout component that defines the overall structure of the application.
 * It includes the HTML, body, and integrates the Navbar and other global components.
 *
 * @param {Readonly<{ children: React.ReactNode }>} { children } - The child components to be rendered within the layout.
 * @returns {JSX.Element} The root layout of the application.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Logger />
          <Navigation />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
