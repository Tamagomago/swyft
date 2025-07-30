import AuthHeader from '@/components/ui/AuthHeader';
import AuthDescription from '@/components/ui/AuthDescription';
import AuthCard from '@/components/ui/AuthCard';

function LoginForm() {
  return (
    <AuthCard>
      {/* Headers */}
      <div>
        <AuthHeader>Login</AuthHeader>
        <AuthDescription>Enter your email and password to login to your account.</AuthDescription>
      </div>
    </AuthCard>
  );
}

export default LoginForm;
