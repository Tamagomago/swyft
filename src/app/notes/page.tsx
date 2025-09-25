import React from 'react';
import { Metadata } from 'next';
import WelcomePanel from '@/components/welcome-panel';

export const metadata: Metadata = {
  title: 'Notes | Swyft',
  keywords: ['Swyft', 'notes', 'dashboard', 'welcome'],
  description: 'Welcome to Swyft, your personal note-taking app.',
};

function Page() {
  return <WelcomePanel />;
}

export default Page;
