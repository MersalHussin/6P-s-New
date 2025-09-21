"use client";

import { Suspense } from 'react';

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return <Suspense>{children}</Suspense>;
}
