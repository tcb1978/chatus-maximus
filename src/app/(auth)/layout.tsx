import type { FC } from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({
  children,
}): JSX.Element => {
  return (
    <div className='bg-red-500'>{children}</div>
  );
};

export default AuthLayout;