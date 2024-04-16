'use client';

import { UploadDropzone } from '@/lib/uploadthing';
import '@uploadthing/react/styles.css';
import type { FC } from 'react';
import { FileIcon, X } from 'lucide-react';
import Image from 'next/image';
import { ModalEnum } from '@/hooks/use-modal-store';

interface FileUploadProps {
  endpoint: ModalEnum.MessageFile | ModalEnum.ServerImage;
  value: string;
  onChange: (url?: string) => void;
}

const FileUpload: FC<FileUploadProps> = ({
  endpoint,
  value,
  onChange,
}): JSX.Element => {

  const fileType = value?.split('.').pop();

  if (value && fileType !== 'pdf') {
    return (
      <div className='relative h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center'>
        <Image
          fill
          alt='Uploaded'
          className='rounded-full'
          src={value}
        />
        <button>
          <X
            aria-label='Remove'
            className='absolute top-0 right-0 p-1 h-4 w-4 text-white bg-rose-500 rounded-full shadow-sm hover:bg-rose-600 transition-colors'
            role='button'
            type='button'
            onClick={() => onChange()}
          />
        </button>
      </div>
    );
  }

  if (value && fileType === 'pdf') {
    return (
      <div className='relative p-2 mt-2 rounded-md flex items-center bg-background/10'>
        <FileIcon className='h-10 w-10 fill-indigo-200 stroke-indigo-400' />
        <a
          href={value}
          target='_blank'
          rel='nopener noreferrer'
          className='text-indigo-500 hover:underline dark:text-indigo-400 transition-colors ml-2 text-sm'
        >
          {value}
        </a>
        <button>
          <X
            aria-label='Remove'
            className='absolute -top-0 -right-0 p-1 h-4 w-4 text-white bg-rose-500 rounded-full shadow-sm hover:bg-rose-600 transition-colors'
            role='button'
            type='button'
            onClick={() => onChange()}
          />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0]?.url);
      }}
      onUploadError={(error: Error) => {
        console.error(error);
      }}
    />
  );
};

export default FileUpload;