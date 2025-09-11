
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

const content = {
    ar: {
        title: "إعادة تعيين كلمة المرور",
        description: "أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة مرورك.",
        emailLabel: "البريد الإلكتروني",
        sendButton: "إرسال رابط إعادة التعيين",
        backToSignIn: "العودة لتسجيل الدخول",
        toastSuccessTitle: "تم إرسال الرابط بنجاح!",
        toastSuccessDescription: "يرجى التحقق من بريدك الإلكتروني.",
        toastErrorTitle: "فشل الإرسال",
    },
    en: {
        title: "Reset Your Password",
        description: "Enter your email and we'll send you a link to reset your password.",
        emailLabel: "Email",
        sendButton: "Send Reset Link",
        backToSignIn: "Back to Sign In",
        toastSuccessTitle: "Link Sent Successfully!",
        toastSuccessDescription: "Please check your email inbox.",
        toastErrorTitle: "Failed to Send",
    }
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();
  const c = content[language];
  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowLeft;

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: c.toastSuccessTitle,
        description: c.toastSuccessDescription,
      });
    } catch (error: any) {
      toast({
        title: c.toastErrorTitle,
        description: error.message,
        variant: 'destructive',
      });
    } finally {
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
          <form onSubmit={handlePasswordReset} className="space-y-4">
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
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {c.sendButton}
            </Button>
          </form>
          <Button variant="link" className="w-full mt-4" asChild>
            <Link href="/auth/user/signin">
              <ArrowIcon className={language === 'ar' ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
              {c.backToSignIn}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
