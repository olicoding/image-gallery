import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// export const revalidate = 3600;

export const metadata = {
  title: "Image Gallery",
  description: "Modern image gallery",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black antialiased">
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
