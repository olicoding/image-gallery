import { Suspense } from "react";
import Loading from "@/server-components/Loading";
import Dashboard from "@/server-components/Dashboard";

const Admin = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Dashboard />;
    </Suspense>
  );
};

export default Admin;
