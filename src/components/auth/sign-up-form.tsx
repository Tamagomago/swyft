'use client';

import React from 'react';
import AuthCard from '@/components/ui/auth-card';
import AuthHeader from '@/components/ui/auth-header';
import AuthTitle from '@/components/ui/auth-title';
import AuthDescription from '@/components/ui/auth-description';
import AuthContent from '@/components/ui/auth-content';
import Label from '@/components/ui/label';
import Input from '@/components/ui/input';
import Link from 'next/link';
import Button from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

function SignUpForm() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [repeatPassword, setRepeatPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm?next=/home`,
        },
      });

      if (error) throw error;
      router.push('/auth/sign-up-success');
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard>
      <AuthHeader>
        <AuthTitle>Get Started</AuthTitle>
        <AuthDescription>Create a new account</AuthDescription>
      </AuthHeader>
      <form onSubmit={handleSignUp}>
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
          </div>

          {/* Repeat Password */}
          <div className={'w-full flex flex-col gap-2'}>
            <Label htmlFor={'password'}>Repeat Password</Label>
            <Input
              className={`${error ? 'border-error bg-error/10! ring-error' : ''} ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
              id={'repeat-password'}
              type={'password'}
              placeholder={'••••••••'}
              required
              value={repeatPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setRepeatPassword(e.target.value)
              }
            />
            {error && <p className={'text-sm text-error'}>{error}</p>}
          </div>

          {/* Sign Up Button */}
          <div className={'mt-3 w-full'}>
            <Button
              type={'submit'}
              className={`bg-button-background w-full text-button-foreground ${isLoading ? 'cursor-not-allowed bg-button-hover! opacity-50' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Creating your account ...' : 'Sign Up'}
            </Button>
          </div>

          {/* Redirect to Sign-up */}
          <div className={'w-full flex text-sm justify-center text-muted'}>
            Already have an account? &nbsp;
            <Link href={'/auth/login'} className={'hover:underline text-sm! hover:text-foreground'}>
              Login
            </Link>
          </div>
        </AuthContent>
      </form>
    </AuthCard>
  );
}

export default SignUpForm;
