
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword } from 'firebase/auth';
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
        title: "أنشئ حسابًا جديدًا",
        description: "ابدأ رحلتك نحو اكتشاف شغفك اليوم.",
        emailLabel: "البريد الإلكتروني",
        passwordLabel: "كلمة المرور",
        confirmPasswordLabel: "تأكيد كلمة المرور",
        signUpButton: "إنشاء حساب",
        hasAccount: "لديك حساب بالفعل؟",
        signIn: "سجل دخولك",
        toastErrorTitle: "فشل إنشاء الحساب",
        toastPasswordMismatch: "كلمتا المرور غير متطابقتين.",
        toastSuccessTitle: "تم إنشاء الحساب بنجاح!",
        toastSuccessDescription: "سيتم توجيهك الآن...",
    },
    en: {
        title: "Create a New Account",
        description: "Start your journey to discovering your passion today.",
        emailLabel: "Email",
        passwordLabel: "Password",
        confirmPasswordLabel: "Confirm Password",
        signUpButton: "Create Account",
        hasAccount: "Already have an account?",
        signIn: "Sign in",
        toastErrorTitle: "Sign Up Failed",
        toastPasswordMismatch: "The passwords do not match.",
        toastSuccessTitle: "Account Created Successfully!",
        toastSuccessDescription: "Redirecting you now...",
    }
}

export default function UserSignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { language } = useLanguage();
  const c = content[language];

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Card className="w-full max-w-sm mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">{c.title}</CardTitle>
          <CardDescription>{c.description}</CardDescription>
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
