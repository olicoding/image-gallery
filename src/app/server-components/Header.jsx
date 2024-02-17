import React, { Suspense } from "react";

const SidebarMenu = React.lazy(() => import("@/components/SidebarMenu"));

export default function Header() {
  return (
    <header className="flex min-h-10 justify-end bg-black px-5 pb-1 pt-3 text-white">
      <Suspense>
        <SidebarMenu />
      </Suspense>
    </header>
  );
}
