import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import FetchedImages from "src/app/FetchedImages";
import ContextProvider from "src/context/ContextProvider";
import Header from "src/components/header/Header";
import Footer from "src/components/footer/Footer";

export const metadata = {
  title: "Image Gallery",
  description: "Modern Image Gallery",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex h-svh flex-col content-center justify-between bg-black antialiased">
        <FetchedImages>
          {(images) => (
            <ContextProvider initialImages={images}>
              <Analytics />
              <Header />
              <main className="mx-auto max-w-6xl">{children}</main>
              <Footer />
            </ContextProvider>
          )}
        </FetchedImages>
      </body>
    </html>
  );
}
