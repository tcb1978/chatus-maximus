import type { FC } from 'react';
import { SignUp } from '@clerk/nextjs';

interface SignupProps {

}

const Signup: FC<SignupProps> = ({ }) => {
  return (<SignUp />);
};

export default Signup;