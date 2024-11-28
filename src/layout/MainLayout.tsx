import React, { PropsWithChildren } from "react";
import Header from "./Header/Header";
import Footer from "./footer/Footer";

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default MainLayout;
