import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
             <header className="py-4 border-b">
                <div className="container mx-auto flex justify-between items-center">
                <Link href="/" passHref>
                    <h1 className="text-2xl font-headline font-bold text-primary">
                        Admin Dashboard
                    </h1>
                </Link>
                <Link href="/" passHref>
                    <Button variant="ghost">Home</Button>
                </Link>
                </div>
            </header>
            <main className="container mx-auto px-4 py-8">
                <AdminDashboard />
            </main>
        </div>
    )
}
