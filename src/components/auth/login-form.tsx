'use client';

import React from 'react';
import AuthTitle from '@/components/ui/auth-title';
import AuthDescription from '@/components/ui/auth-description';
import AuthCard from '@/components/ui/auth-card';
import AuthHeader from '@/components/ui/auth-header';
import AuthContent from '@/components/ui/auth-content';
import Label from '@/components/ui/label';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

function LoginForm() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      console.log('Login successful');
      router.push('/protected');
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard>
      <AuthHeader>
        <AuthTitle>Login</AuthTitle>
        <AuthDescription>Enter your email to login to your account.</AuthDescription>
      </AuthHeader>
      <form onSubmit={handleLogin}>
        <AuthContent>
          {/* Email */}
          <div className={'w-full flex flex-col gap-2'}>
            <Label htmlFor={'email'}>Email</Label>
            <Input
              className={`${error ? 'border-error bg-error/10! ring-error' : ''} ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
              id={'email'}
              type={'email'}
              placeholder={'you@example.com'}
              value={email}
              required
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className={'w-full flex flex-col gap-2'}>
            <div className={'flex justify-between'}>
              <Label htmlFor={'password'}>Password</Label>
              <Link
                href={'/auth/forgot-password'}
                className={'text-muted font-medium text-sm hover:underline hover:text-foreground'}
              >
                Forgot Password?
              </Link>
            </div>
            <Input
              className={`${error ? 'border-error bg-error/10! ring-error' : ''} ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
              id={'password'}
              type={'password'}
              placeholder={'••••••••'}
              required
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
            {error && <p className={'text-sm text-error'}>{error}</p>}
          </div>

          {/* Login Button */}
          <div className={'mt-3 w-full'}>
            <Button
              type={'submit'}
              className={`bg-button-background w-full text-button-foreground ${isLoading ? 'cursor-not-allowed bg-button-hover! opacity-50' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in ...' : 'Login'}
            </Button>
          </div>

          {/* Redirect to Sign-up */}
          <div className={'w-full flex text-sm justify-center text-muted'}>
            Don&apos;t have an account?
            <Link
              href={'/auth/sign-up'}
              className={'hover:underline text-sm! hover:text-foreground ml-2'}
            >
              Sign Up Now
            </Link>
          </div>
        </AuthContent>
      </form>
    </AuthCard>
  );
}

export default LoginForm;
