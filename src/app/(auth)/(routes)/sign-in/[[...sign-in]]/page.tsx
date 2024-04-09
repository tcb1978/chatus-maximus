import type { FC } from 'react';
import { SignIn } from '@clerk/nextjs';

interface SigninProps {

}

const Signin: FC<SigninProps> = ({ }) => {
  return (<SignIn />);
};

export default Signin;