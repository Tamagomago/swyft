import React from 'react';
import SignUpForm from '@/components/auth/sign-up-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up | Swyft',
  keywords: ['Swyft', 'sign up', 'create account', 'registration'],
  description: 'Create a new account to access Swyft.',
};

function Page() {
  return (
    <div className={' flex h-full items-center justify-center font-600 text-foreground'}>
      <SignUpForm />
    </div>
  );
}

export default Page;
