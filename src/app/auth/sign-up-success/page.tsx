import React from 'react';
import AuthCard from '@/components/ui/auth/auth-card';
import AuthTitle from '@/components/ui/auth/auth-title';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up Success | Swyft',
  keywords: ['Swyft', 'sign up success', 'registration complete', 'authentication'],
  description:
    'You have successfully signed up. Please check your email to confirm before signing in.',
};

function Page() {
  return (
    <div className={' flex h-full items-center justify-center font-600 text-foreground'}>
      <AuthCard>
        <AuthTitle>Thank you for signing up!</AuthTitle>
        <div className={'mt-3'}>
          <p className={'text-sm text-foreground font-sm'}>
            You have successfully signed up. Please check your email to confirm before signing in.
          </p>
        </div>
      </AuthCard>
    </div>
  );
}

export default Page;
