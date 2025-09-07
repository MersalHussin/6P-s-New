"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function AdminPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                router.push('/auth/signin');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    const handleSignOut = async () => {
        await auth.signOut();
        router.push('/auth/signin');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    if (!user) {
        return null; // or a redirect component
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
             <header className="py-4 border-b">
                <div className="container mx-auto flex justify-between items-center">
                <Link href="/" passHref>
                    <h1 className="text-2xl font-headline font-bold text-primary">
                        Admin Dashboard
                    </h1>
                </Link>
                <div className="flex items-center gap-4">
                     <span className="text-sm text-muted-foreground hidden sm:inline">Welcome, {user.email}</span>
                    <Button variant="ghost" onClick={handleSignOut}>Sign Out</Button>
                    <Link href="/" passHref>
                        <Button variant="outline">Home</Button>
                    </Link>
                </div>
                </div>
            </header>
            <main className="container mx-auto px-4 py-8">
                <AdminDashboard />
            </main>
        </div>
    )
}
