"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ProtectedRoute from "../ProtectedRoute";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({
  children,
}: AppLayoutProps) {

  return (

    <ProtectedRoute>

      <div className="flex min-h-screen bg-gray-100">

        <Sidebar />

        <div className="flex-1 flex flex-col">

          <Header />

          <main className="flex-1 p-8">

            {children}

          </main>

        </div>

      </div>

    </ProtectedRoute>

  );

}