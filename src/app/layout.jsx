import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import FetchedImages from "@/server-components/FetchedImages";
import ContextProvider from "@/context/ContextProvider";
import Footer from "@/server-components/Footer";
import Header from "@/components/Header";

export const metadata = {
  title: "Image Gallery",
  description:
    "A Modern Image Gallery With Drag'n Drop & Carousel Interactive Features",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex h-svh flex-col content-center justify-start bg-black antialiased">
        <FetchedImages>
          {(images) => (
            <ContextProvider initialImages={images}>
              <Analytics />
              <Header />
              <main className="mx-auto max-w-6xl grow">{children}</main>
              <Footer />
            </ContextProvider>
          )}
        </FetchedImages>
      </body>
    </html>
  );
}
