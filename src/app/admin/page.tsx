
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";

// Key for session storage
const ADMIN_ACCESS_KEY = "admin-access-granted";

export default function AdminPage() {
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        try {
            const accessGranted = sessionStorage.getItem(ADMIN_ACCESS_KEY);
            if (accessGranted === "true") {
                setIsVerified(true);
            } else {
                router.replace('/admin/signin');
            }
        } catch (error) {
            // This can happen in environments where sessionStorage is not available.
            console.error("Session storage not available. Redirecting to sign-in.");
            router.replace('/admin/signin');
        } finally {
            setLoading(false);
        }
    }, [router]);

    const handleSignOut = () => {
        try {
            sessionStorage.removeItem(ADMIN_ACCESS_KEY);
        } catch (error) {
            console.error("Failed to clear session storage.");
        }
        router.push('/admin/signin');
    };

    if (loading || !isVerified) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
             <header className="py-4 border-b">
                <div className="container mx-auto flex justify-between items-center">
                <Link href="/admin" passHref>
                    <h1 className="text-2xl font-headline font-bold text-primary">
                        Admin Dashboard
                    </h1>
                </Link>
                <div className="flex items-center gap-4">
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
