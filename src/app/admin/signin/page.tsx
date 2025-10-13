
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, KeyRound } from 'lucide-react';
import Link from 'next/link';

// Key for session storage
const ADMIN_ACCESS_KEY = "admin-access-granted";

export default function AdminSignInPage() {
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (!accessCode) {
        toast({
            title: 'Error',
            description: "Please enter an access code.",
            variant: 'destructive',
        });
        setLoading(false);
        return;
    }

    try {
      const configDocRef = doc(db, 'config', 'admin');
      const configDoc = await getDoc(configDocRef);

      if (configDoc.exists()) {
        const correctCode = configDoc.data().accessCode;
        if (accessCode === correctCode) {
            try {
                sessionStorage.setItem(ADMIN_ACCESS_KEY, "true");
                toast({
                    title: 'Access Granted',
                    description: "Redirecting to dashboard...",
                });
                router.push('/admin');
            } catch (sessionError) {
                toast({
                    title: 'Login failed',
                    description: "Could not set session. Please enable cookies/session storage.",
                    variant: 'destructive',
                });
                setLoading(false);
            }
        } else {
            toast({
                title: 'Access Denied',
                description: "The access code is incorrect.",
                variant: 'destructive',
            });
            setLoading(false);
        }
      } else {
         toast({
            title: 'Configuration Error',
            description: "Admin access code is not set up in the database.",
            variant: 'destructive',
        });
        setLoading(false);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                <KeyRound className="h-8 w-8 text-primary"/>
            </div>
          <CardTitle className="text-2xl font-headline">Admin Access</CardTitle>
          <CardDescription>Enter the access code to manage the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="access-code">Access Code</Label>
              <Input
                id="access-code"
                type="password"
                placeholder="••••••••"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify
            </Button>
          </form>
          <Button variant="link" asChild className="w-full mt-4">
            <Link href="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

