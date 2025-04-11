"use client";
import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="bg-base-100 flex flex-1 items-center justify-center px-4 py-8">
      {children}
    </div>
  );
};

export default Layout;
