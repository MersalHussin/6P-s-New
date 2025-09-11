
"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

const content = {
    ar: {
        title: "أهلاً بعودتك!",
        description: "سجّل دخولك لمتابعة رحلتك في اكتشاف الشغف.",
        emailLabel: "البريد الإلكتروني",
        passwordLabel: "كلمة المرور",
        forgotPassword: "هل نسيت كلمة المرور؟",
        signInButton: "تسجيل الدخول",
        noAccount: "ليس لديك حساب؟",
        signUp: "أنشئ حسابًا جديدًا",
        toastErrorTitle: "فشل تسجيل الدخول",
        toastErrorDescription: "البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.",
        toastSuccessTitle: "تم تسجيل الدخول بنجاح",
        toastSuccessDescription: "جاري توجيهك الآن...",
    },
    en: {
        title: "Welcome Back!",
        description: "Sign in to continue your passion discovery journey.",
        emailLabel: "Email",
        passwordLabel: "Password",
        forgotPassword: "Forgot your password?",
        signInButton: "Sign In",
        noAccount: "Don't have an account?",
        signUp: "Create a new account",
        toastErrorTitle: "Sign In Failed",
        toastErrorDescription: "Incorrect email or password. Please try again.",
        toastSuccessTitle: "Signed In Successfully",
        toastSuccessDescription: "Redirecting you now...",
    }
}

export default function UserSignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { language } = useLanguage();
  const c = content[language];

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Card className="w-full max-w-sm mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">{c.title}</CardTitle>
          <CardDescription>{c.description}</CardDescription>
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
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                dir="ltr"
              />
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
