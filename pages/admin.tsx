import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import Dashboard from "../components/admin/Dashboard";
import Head from "next/head";

const Admin: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Image Gallery | Admin</title>
      </Head>
      <header className="flex justify-between bg-black p-4 text-white">
        <h1 className="text-lg">Admin Area</h1>
        <Link href="/" className="hover:underline">
          Logout
        </Link>
      </header>
      <main>
        <Dashboard />
      </main>
    </div>
  );
};

export default Admin;

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Authentication logic
  // For now, let's just allow access, but you'll need to replace this with actual authentication check

  return {
    props: {},
  };
};
