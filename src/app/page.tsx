"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

const HomePage = dynamic(() => import("@/page-component/homePage/HomePage"), {
  ssr: false,
});
export default function Home() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = 'Client-Side Title';
    }
  }, []);
  return (
    <>
      <HomePage />
    </>
  );
}
