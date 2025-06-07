import Header from "@/components/Header";
import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen ">
      <Header />
      {children}
    </div>
  );
};

export default Layout;
