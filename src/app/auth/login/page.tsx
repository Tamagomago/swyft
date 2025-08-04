import LoginForm from '@/components/auth/login-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | Swyft',
  keywords: ['Swyft', 'login', 'authentication', 'account access'],
  description: 'Access your Swyft account. Login to manage your profile.',
};

function Page() {
  return (
    <div className={' flex h-full items-center justify-center font-600 text-foreground'}>
      <LoginForm />
    </div>
  );
}

export default Page;
