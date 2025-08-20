"use client"

interface ImageUploadProps {
    onChange: (url:string) => void
    value: string;
    endpoint: "postImage"
}

import { UploadDropzone } from '@/lib/uploadthing';
import { XIcon } from 'lucide-react';
import React from 'react'

function ImageUploader({endpoint,onChange,value}:ImageUploadProps) {

    if(value) {
        return (
            <div className="relative size-40 ">
                <img src={value} alt="Upload" className='rounded-md size-40 object-cover' />
                <button 
                onClick={() => onChange("")}
                className='absolute top-0 right-0 p-1 bg-red-500 rounded-full shadow-sm'
                type="button"
                >
                <XIcon className='h-4 w-4 text-white'/>
                </button>
            </div>
        )
    }
  return (
    <div className='w-full'>
    <UploadDropzone
    className='className="w-full max-w-lg h-20 border-gray-300 rounded-lg '
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
            onChange(res?.[0].url)
        }}
        onUploadError={(error:Error) => {
            console.log(error);
        }}
    />
    </div>
  )
}

export default ImageUploader