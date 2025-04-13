'use client'
import type React from 'react';
import { ReactNode } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import Navbar from '../components/navbar/Navbar';
import { DashboardProvider } from '@/contexts/DashboardContext';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardProvider>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </DashboardProvider>
  );
}