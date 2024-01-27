import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Header from "src/components/header/Header";
import Footer from "src/components/footer/Footer";

// export const revalidate = 3600;

export const metadata = {
  title: "Image Gallery",
  description: "Modern Image Gallery",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex h-svh flex-col content-center justify-between bg-black antialiased">
        <Header />
        <main className="mx-auto max-w-6xl">
          {children}
          <Analytics />
        </main>
        <Footer />
      </body>
    </html>
  );
}
