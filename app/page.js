import Head from "next/head";
import { useSearchParams } from "next/navigation";

// preparing to migrate from pages to app directory

const HomePage = ({ children }) => {
  const searchParams = useSearchParams();

  return (
    <>
      <Head>
        <title>Image Gallery</title>
        <meta name="description" content="A modern photo gallery." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>{children}</main>
    </>
  );
};

export default HomePage;
