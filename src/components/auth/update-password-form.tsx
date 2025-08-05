'use client';

import React from 'react';
import AuthHeader from '@/components/ui/auth-header';
import AuthTitle from '@/components/ui/auth-title';
import AuthDescription from '@/components/ui/auth-description';
import AuthContent from '@/components/ui/auth-content';
import Label from '@/components/ui/label';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import AuthCard from '@/components/ui/auth-card';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

function UpdatePasswordForm() {
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const handdleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      router.push('/home');
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <AuthCard>
      <AuthHeader>
        <AuthTitle>Reset your password</AuthTitle>
        <AuthDescription>Please enter your new password below</AuthDescription>
      </AuthHeader>
      <form onSubmit={handdleUpdatePassword}>
        <AuthContent>
          {/* Email */}
          <div className={'flex flex-col gap-2 w-full'}>
            <Label htmlFor={'email'}>New password</Label>
            <Input
              className={`${error ? 'border-error bg-error/10! ring-error' : ''} ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
              id={'password'}
              type={'password'}
              placeholder={'••••••••'}
              value={password}
              required
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
            {error && <p className={'text-sm text-error'}>{error}</p>}
          </div>
          <hr className={'w-full text-muted/50 mt-3'} />

          {/* Send Reset Code */}
          <Button
            type={'submit'}
            className={`bg-button-background w-full text-button-foreground ${isLoading ? 'cursor-not-allowed bg-button-hover! opacity-50' : ''}`}
          >
            {isLoading ? 'Saving...' : 'Save new password'}
          </Button>
        </AuthContent>
      </form>
    </AuthCard>
  );
}

export default UpdatePasswordForm;
