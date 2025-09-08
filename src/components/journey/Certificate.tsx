
"use client";

import React from 'react';

interface CertificateProps {
  name: string;
  passion: string;
  userId: string;
}

export const Certificate = React.forwardRef<HTMLDivElement, CertificateProps>(({ name, passion, userId }, ref) => {
  const date = new Date();
  const dateStr = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  return (
    <div
      ref={ref}
      className="fixed left-[-9999px] top-[-9999px] w-[1123px] h-[794px] bg-white font-body"
      style={{
        backgroundImage: "url('https://i.suar.me/9laZP/l')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative w-full h-full">
        {/* Certificate ID */}
        <p className="absolute top-[65px] left-[88px] text-[#444444] text-[15px]">
          Certificate ID: {userId}
        </p>

        {/* User Name */}
        <p className="absolute top-[320px] w-full text-center text-black text-[50px] font-headline font-bold">
          {name}
        </p>

        {/* Encouraging Message */}
        <div className="absolute top-[410px] w-full text-center px-[220px]">
           <p className="text-[#002B7F] text-[20px] leading-snug">
            Congratulations on successfully completing the 6Ps Journey. Your passion has been identified as: {passion}. We are proud of your effort and wish you success in turning your passion into impact.
           </p>
        </div>

        {/* Date */}
        <p className="absolute bottom-[173px] left-[240px] text-black text-[20px] font-semibold">
          {dateStr}
        </p>
      </div>
    </div>
  );
});

Certificate.displayName = 'Certificate';
