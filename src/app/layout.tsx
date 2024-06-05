"use client";
import "./globals.css";
import { Rubik } from "next/font/google";

import React from "react";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";

import Layout from "@/components/Layout";
import LoginModal from "@/components/modals/LoginModal";
import RegisterModal from "@/components/modals/RegisterModal";
import EditModel from "@/components/modals/EditModel";

const inter = Rubik({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <SessionProvider>
          <Toaster />
          <EditModel />
          <RegisterModal />
          <LoginModal />
          <Layout>{children}</Layout>
        </SessionProvider>
      </body>
    </html>
  );
}
