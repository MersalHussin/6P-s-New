
"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Home, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { content as allContent } from '@/lib/content';

function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { language } = useLanguage();
  const c = allContent[language].auth;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: c.toastSuccessTitle,
        description: c.toastSuccessDescription,
      });
      const redirectUrl = searchParams.get('redirect') || '/journey';
      router.push(redirectUrl);
    } catch (error: any) {
      toast({
        title: c.toastErrorTitle,
        description: c.toastErrorDescription,
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="absolute top-4 left-4" dir="ltr">
            <Link href="/" passHref>
                <Button variant="outline"><Home className="mr-2 h-4 w-4" /> {c.backToHome}</Button>
            </Link>
        </div>
        
        <Link href="/" passHref className="mb-8">
             <div className="relative h-12 w-48">
                <Image src="https://i.suar.me/1AxXY/l" alt="Passion Path Logo" fill style={{ objectFit: 'contain' }}/>
            </div>
        </Link>
        
      <Card className="w-full max-w-sm mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">{c.signInTitle}</CardTitle>
          <CardDescription>{c.signInDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{c.emailLabel}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{c.passwordLabel}</Label>
                <Link href="/auth/user/forgot-password" className="text-sm text-primary hover:underline">
                    {c.forgotPassword}
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {c.signInButton}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
            <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        {c.noAccount}
                    </span>
                </div>
            </div>
            <Button variant="outline" className="w-full" asChild>
                <Link href="/auth/user/signup">{c.signUp}</Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}


export default function UserSignInPage() {
    return (
        <Suspense>
            <SignInForm />
        </Suspense>
    );
}
