import React from 'react';
import SignUpForm from '@/components/auth/sign-up-form';

function Page() {
  return (
    <div className={' flex h-full items-center justify-center font-600 text-foreground'}>
      <SignUpForm />
    </div>
  );
}

export default Page;
