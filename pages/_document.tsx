import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="See pictures in a modern photo gallery."
          />
          <meta
            property="og:site_name"
            content="photo-gallery-olicoding.vercel.app"
          />
          <meta
            property="og:description"
            content="See pictures in a modern photo gallery."
          />
          <meta
            property="og:title"
            content="See pictures in a modern photo gallery."
          />
        </Head>
        <body className="bg-black antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
