
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Award, User, Sparkles } from "lucide-react";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { UserData } from "@/lib/types";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";

const content = {
    ar: {
        title: "التحقق من الشهادة",
        description: "أدخل كود الشهادة الموجود في أعلى شهادتك للتحقق من صحتها.",
        label: "كود الشهادة",
        placeholder: "أدخل الكود هنا",
        button: "تحقق",
        loading: "جاري التحقق...",
        notFound: {
            title: "لم يتم العثور على الشهادة",
            description: "الكود الذي أدخلته غير صحيح. يرجى التأكد منه والمحاولة مرة أخرى.",
        },
        found: {
            title: "تم التحقق من الشهادة بنجاح!",
            name: "الاسم",
            passion: "الشغف الموصى به",
        },
        error: "حدث خطأ أثناء التحقق. يرجى المحاولة مرة أخرى.",
        home: "الصفحة الرئيسية",
    },
    en: {
        title: "Certificate Verification",
        description: "Enter the certificate ID found at the top of your certificate to verify its authenticity.",
        label: "Certificate ID",
        placeholder: "Enter ID here",
        button: "Verify",
        loading: "Verifying...",
        notFound: {
            title: "Certificate Not Found",
            description: "The ID you entered is not valid. Please check and try again.",
        },
        found: {
            title: "Certificate Verified Successfully!",
            name: "Name",
            passion: "Top Recommended Passion",
        },
        error: "An error occurred during verification. Please try again.",
        home: "Home",
    },
};

export default function CheckCertificatePage() {
  const [certificateId, setCertificateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UserData | null | 'not-found'>(null);
  const { toast } = useToast();
  const { language } = useLanguage();
  const c = content[language];

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const trimmedId = certificateId.trim();
    if (!trimmedId) {
        setLoading(false);
        return;
    }

    try {
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("shortId", "==", trimmedId), limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        if (userDoc.exists() && userDoc.data().resultsData) {
          setResult(userDoc.data() as UserData);
        } else {
          // This case might happen if user exists but results are not calculated yet.
          // For the purpose of verification, we can treat it as not found.
          setResult('not-found');
        }
      } else {
        setResult('not-found');
      }
    } catch (error) {
      toast({
        title: c.error,
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const topPassion = result !== 'not-found' && result?.resultsData?.rankedPassions[0]?.passion;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
       <div className="absolute top-4 left-4">
            <Link href="/" passHref>
                <Button variant="outline">{c.home}</Button>
            </Link>
        </div>
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Award className="h-8 w-8 text-primary" />
            </div>
          <CardTitle className="text-2xl font-headline">{c.title}</CardTitle>
          <CardDescription>{c.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerification} className="flex items-start gap-2">
            <div className="w-full space-y-2">
              <Label htmlFor="certificate-id" className="sr-only">{c.label}</Label>
              <Input
                id="certificate-id"
                placeholder={c.placeholder}
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
               <span className="hidden sm:inline ml-2">{c.button}</span>
            </Button>
          </form>

          {result && (
             <div className="mt-6 border-t pt-6">
                {result === 'not-found' ? (
                     <Card className="bg-destructive/10 border-destructive text-center p-4">
                        <CardHeader>
                            <CardTitle>{c.notFound.title}</CardTitle>
                            <CardDescription className="text-destructive-foreground/80">
                                {c.notFound.description}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ) : (
                    <Card className="bg-green-50 border-green-200 text-center p-4">
                        <CardHeader>
                            <CardTitle className="text-green-800">{c.found.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-lg">
                            <div className="flex items-center justify-center gap-4">
                                <User className="h-6 w-6 text-green-700"/>
                                <p><strong>{c.found.name}:</strong> {result.name}</p>
                            </div>
                            {topPassion && (
                                <div className="flex items-center justify-center gap-4">
                                    <Sparkles className="h-6 w-6 text-green-700"/>
                                    <p><strong>{c.found.passion}:</strong> {topPassion}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
             </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
