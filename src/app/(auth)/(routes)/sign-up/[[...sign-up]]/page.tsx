import type { FC } from 'react';
import { SignIn } from '@clerk/nextjs';

interface SignupProps {

}

const Signup: FC<SignupProps> = ({ }) => {
  return (<SignIn />);
};

export default Signup;