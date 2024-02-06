import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import FetchedImages from "src/app/server-components/FetchedImages";
import ContextProvider from "src/context/ContextProvider";
import Header from "@/components/Header";
import Footer from "src/app/server-components/Footer";

export const metadata = {
  title: "Image Gallery",
  description: "Modern Image Gallery",
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
