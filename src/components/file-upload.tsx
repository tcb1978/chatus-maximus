'use client';

import { UploadDropzone } from '@/lib/uploadthing';
import '@uploadthing/react/styles.css';
import type { FC } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';

interface FileUploadProps {
  endpoint: 'messageFile' | 'serverImage';
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
          src={value}
          alt='Uploaded'
          className='rounded-full'
        />
        <button>
          <X
            className='absolute top-0 right-0 p-1 h-4 w-4 text-white bg-rose-500 rounded-full shadow-sm hover:bg-rose-600 transition-colors'
            onClick={() => onChange()}
            aria-label='Remove'
            role='button'
            type='button'
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