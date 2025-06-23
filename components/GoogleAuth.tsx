import React from 'react';
import { Button } from './ui/button';
import { FaGoogle } from 'react-icons/fa';
import { signIn } from 'next-auth/react';

type Props = {
  disabled: boolean;
};

const GoogleAuth = ({ disabled }: Props) => {
  return (
    <Button
      disabled={disabled}
      variant="outline"
      className="w-full flex items-center justify-center gap-2"
      onClick={() => signIn('google')}
    >
      <FaGoogle size={20} />
      Sign in with Google
    </Button>
  );
};

export default GoogleAuth;
