import type { FC } from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({
  children,
}): JSX.Element => {
  return (
    <div className='h-full flex items-center justify-center'>{children}</div>
  );
};

export default AuthLayout;