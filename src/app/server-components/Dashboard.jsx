import React from "react";
import { CollapsibleProvider } from "@/context/CollapsibleContext";
const SidebarMenu = React.lazy(() => import("@/components/SidebarMenu"));

export default function Dashboard() {
  return (
    <CollapsibleProvider>
      <SidebarMenu />
    </CollapsibleProvider>
  );
}
