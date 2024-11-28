"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import styled from "./Header.module.css";

const Header = () => {
  const path = usePathname();
  if (path === "/") return null;

  return (
    <header className={styled.container}>
      <h1 className={styled.logo}>Ariki Notes</h1>
      <nav className={styled.nav}>
        <Link href="/" className={styled.navLink}>
          Home
        </Link>
        <Link href="/list" className={styled.navLink}>
          Food List
        </Link>
        <Link href="/addToCarts" className={styled.navLink}>
          Food Orders
        </Link>
        <Link href="/dateFood" className={styled.navLink}>
          Date Orders
        </Link>
      </nav>
    </header>
  );
};

export default Header;
