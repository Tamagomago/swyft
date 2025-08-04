import React from 'react';
import ForgotPasswordForm from '@/components/auth/forgot-password-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password | Swyft',
  keywords: ['Swyft', 'forgot password', 'reset password', 'authentication'],
  description: 'Reset your password',
};

function Page() {
  return (
    <div className={' flex h-full items-center justify-center font-600 text-foreground'}>
      <ForgotPasswordForm />
    </div>
  );
}

export default Page;
