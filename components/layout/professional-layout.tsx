'use client';

import { ReactNode } from 'react';
import { ProfessionalNavbar } from './professional-navbar';

interface ProfessionalLayoutProps {
  children: ReactNode;
}

export function ProfessionalLayout({ children }: ProfessionalLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <ProfessionalNavbar />
      <main className="container mx-auto px-4 py-6 mt-2">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}