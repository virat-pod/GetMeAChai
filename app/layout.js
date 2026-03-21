import {
  Geist,
  Geist_Mono,
  Lato,
  Roboto,
  Dancing_Script,
} from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/wrappers/sessionWrapper";
import ScrollWrapper from "@/components/wrappers/scrollWrapper";
import { SidebarProvider } from "@/lib/contexts/SidebarContext";
import { ServiceProvider } from "@/lib/contexts/ServiceContext";

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Get Me A Chai",
  description: "Support your favourite creators with a chai ☕",
  icons: { icon: "/images/tea.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${lato.variable} ${dancingScript.variable} ${roboto.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <SessionWrapper>
           <ServiceProvider>
            <SidebarProvider>
              <ScrollWrapper>{children}</ScrollWrapper>
            </SidebarProvider>
             </ServiceProvider>
          </SessionWrapper>
      </body>
    </html>
  );
}
