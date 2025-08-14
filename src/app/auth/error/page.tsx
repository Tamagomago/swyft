import React from 'react';
import AuthCard from '@/components/ui/auth/auth-card';
import AuthTitle from '@/components/ui/auth/auth-title';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Error | Swyft',
  keywords: ['Swyft', 'error', 'authentication', 'issue'],
  description: 'An error occurred during authentication. Please try again.',
};

async function Page({ searchParams }: { searchParams: Promise<{ error: string }> }) {
  const params = await searchParams;
  return (
    <div className={' flex h-full items-center justify-center font-600 text-foreground'}>
      <AuthCard>
        <AuthTitle>Sorry, something went wrong.</AuthTitle>
        <div className={'mt-3'}>
          <p className={'text-sm text-foreground font-sm'}>
            {params.error
              ? `Error: ${params.error}`
              : 'An unexpected error occurred. Please try again later.'}
          </p>
        </div>
      </AuthCard>
    </div>
  );
}

export default Page;
