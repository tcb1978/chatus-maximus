import { useEffect, useState } from 'react';

const useCommandK = (): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prevOpen) => !prevOpen);
      }
    };

    document.addEventListener('keydown', down);

    return () => {
      document.removeEventListener('keydown', down);
    };
  }, []);

  return [open, setOpen];
};

export default useCommandK;
