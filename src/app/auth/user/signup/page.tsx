
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Home } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { content as allContent } from '@/lib/content';


export default function UserSignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { language } = useLanguage();
  const c = allContent[language].auth;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: c.toastErrorTitle,
        description: c.toastPasswordMismatch,
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: c.toastSuccessTitle,
        description: c.toastSuccessDescription,
      });
      // Redirect to onboarding or journey page after sign up
      router.push('/journey/onboarding'); 
    } catch (error: any) {
      toast({
        title: c.toastErrorTitle,
        description: error.message,
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
          <CardTitle className="text-2xl font-headline">{c.signUpTitle}</CardTitle>
          <CardDescription>{c.signUpDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
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
              <Label htmlFor="password">{c.passwordLabel}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">{c.confirmPasswordLabel}</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                dir="ltr"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {c.signUpButton}
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
                        {c.hasAccount}
                    </span>
                </div>
            </div>
            <Button variant="outline" className="w-full" asChild>
                <Link href="/auth/user/signin">{c.signIn}</Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
