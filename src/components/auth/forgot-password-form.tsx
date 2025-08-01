'use client';

import React from 'react';
import AuthCard from '@/components/ui/auth-card';
import AuthHeader from '@/components/ui/auth-header';
import AuthTitle from '@/components/ui/auth-title';
import AuthDescription from '@/components/ui/auth-description';
import AuthContent from '@/components/ui/auth-content';
import Label from '@/components/ui/label';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

function ForgotPasswordForm() {
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {success ? (
        <AuthCard>
          <AuthTitle>Check Your Email</AuthTitle>
          <AuthDescription>Password reset instructions sent</AuthDescription>
          <div className={'mt-3'}>
            <p className={'text-sm text-foreground font-sm'}>
              If you registered using your email and password, you will receive a password reset
              email
            </p>
          </div>
        </AuthCard>
      ) : (
        <AuthCard>
          <AuthHeader>
            <AuthTitle>Forgot your password?</AuthTitle>
            <AuthDescription>
              Type in your email and we'll send you a link to reset your password
            </AuthDescription>
          </AuthHeader>
          <form onSubmit={handleForgotPassword}>
            <AuthContent>
              {/* Email */}
              <div className={'flex flex-col gap-2 w-full'}>
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
                {error && <p className={'text-sm text-error'}>{error}</p>}
              </div>
              <hr className={'w-full text-muted/50 mt-3'} />

              {/* Send Reset Code */}
              <Button
                type={'submit'}
                className={`bg-button-background w-full text-button-foreground ${isLoading ? 'cursor-not-allowed bg-button-hover! opacity-50' : ''}`}
              >
                {isLoading ? 'Sending' : 'Send reset code'}
              </Button>

              {/* Redirect to Log in */}
              <div className={'w-full flex text-sm justify-center text-muted'}>
                Already have an account?
                <Link
                  href={'/auth/login'}
                  className={'hover:underline text-sm! hover:text-foreground ml-2'}
                >
                  Login
                </Link>
              </div>
            </AuthContent>
          </form>
        </AuthCard>
      )}
    </>
  );
}

export default ForgotPasswordForm;
