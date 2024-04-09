import { UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <div>
      <UserButton afterSignOutUrl='/sign-in'>Sign out</UserButton>
    </div>
  );
}
