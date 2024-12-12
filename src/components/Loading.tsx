// components/Loading.tsx
import React from 'react';
import Image from 'next/image';

const Loading: React.FC = () => {
  return (
    <div className='flex h-full justify-center items-center'>
      <Image unoptimized src="/videos/out1.gif" alt="Loading..." className="w-auto h-20 " width={1000} height={1000}/>
      {/* <video
        className="w-1/2 h-auto object-cover"
        src="/videos/b.webm"
        poster="/videos/ou.gif"
        autoPlay
        loop
        muted
        playsInline
      />*/}
    </div> 
  );
};

export default Loading;
