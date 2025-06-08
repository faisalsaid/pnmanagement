import { auth } from '@/auth';
import React from 'react';

const page = async () => {
  const session = await auth();
  return (
    <div>
      <h1>{session?.user.email}</h1>
      <h1>{session?.user.role}</h1>
    </div>
  );
};

export default page;
