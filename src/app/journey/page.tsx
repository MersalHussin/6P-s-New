"use client";

import { useState, useEffect } from "react";
import type { PassionData, UserData } from "@/lib/types";
import type { RankPassionsOutput } from "@/ai/flows/rank-passions";
import { PassionForm } from "@/components/journey/PassionForm";
import { JourneyNavigator } from "@/components/journey/JourneyNavigator";
import { ResultsDisplay } from "@/components/journey/ResultsDisplay";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/context/language-context";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { Loader2 } from "lucide-react";

const USER_ID_KEY = "passionJourneyUserId_v2";

const dialogContent = {
    ar: {
        title: "لديك جلسة سابقة",
        description: "لقد وجدنا بيانات محفوظة من رحلتك الأخيرة. هل تود المتابعة من حيث توقفت، أم بدء رحلة جديدة؟",
        continue: "المتابعة",
        startNew: "بدء رحلة جديدة",
        loading: "جاري تحميل بياناتك...",
        noUser: "لم نجد مستخدمًا. سيتم توجيهك للبداية."
    },
    en: {
        title: "You have a previous session",
        description: "We found saved data from your last journey. Would you like to continue where you left off, or start a new journey?",
        continue: "Continue",
        startNew: "Start New Journey",
        loading: "Loading your data...",
        noUser: "No user found. Redirecting to start."
    }
}

export default function JourneyPage() {
  const [step, setStep] = useState<"loading" | "passions" | "journey" | "results">("loading");
  const [passionsData, setPassionsData] = useState<PassionData[]>([]);
  const [resultsData, setResultsData] = useState<RankPassionsOutput | null>(null);
  const [showContinueDialog, setShowContinueDialog] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { language } = useLanguage();
  const c = dialogContent[language];

  useEffect(() => {
    const storedUserId = localStorage.getItem(USER_ID_KEY);
    if (storedUserId) {
        setUserId(storedUserId);
        setShowContinueDialog(true);
    } else {
        console.warn(c.noUser);
        // Maybe redirect to home page or show a message
        setStep("passions"); // Or redirect: router.push('/')
    }
  }, [c.noUser]);


  const loadUserData = async (currentUserId: string) => {
    try {
        const userDocRef = doc(db, "users", currentUserId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data() as UserData;
            setPassionsData(userData.journeyData || []);
            setResultsData(userData.resultsData || null);
            const currentStep = (userData.currentStation as "passions" | "journey" | "results") || "passions";
            setStep(currentStep);
        } else {
            console.error("No user document found for ID:", currentUserId);
            handleStartNewSession();
        }
    } catch (error) {
        console.error("Failed to load data from Firestore", error);
        handleStartNewSession();
    }
  };
  
  const handleContinueSession = () => {
    if(userId) loadUserData(userId);
    setShowContinueDialog(false);
  };

  const handleStartNewSession = async () => {
    if(userId) {
        try {
            const userDocRef = doc(db, "users", userId);
            await updateDoc(userDocRef, {
                journeyData: [],
                resultsData: null,
                currentStation: 'passions',
            });
        } catch (error) {
            console.error("Failed to clear user data in Firestore", error);
        }
    }
    setPassionsData([]);
    setResultsData(null);
    setStep("passions");
    setShowContinueDialog(false);
  };

  const updateFirestore = async (data: Partial<UserData>) => {
    if (!userId) return;
    try {
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, {
            ...data,
            lastUpdated: serverTimestamp()
        });
    } catch (error) {
        console.error("Error updating document: ", error);
    }
  };

  const handlePassionsSubmit = (passions: { name: string }[]) => {
    const defaultFields = () => [
        { id: '1', text: "", weight: "" as const },
        { id: '2', text: "", weight: "" as const },
        { id: '3', text: "", weight: "" as const },
    ];
    const initialData: PassionData[] = passions.map((p, index) => ({
      id: `passion-${index}`,
      name: p.name,
      purpose: defaultFields(),
      power: defaultFields(),
      proof: defaultFields(),
      problems: defaultFields(),
      possibilities: defaultFields(),
      suggestedSolutions: [],
    }));
    setPassionsData(initialData);
    setStep("journey");
    updateFirestore({ journeyData: initialData, currentStation: "journey" });
  };
  
  const handleJourneyUpdate = (updatedData: PassionData[]) => {
    setPassionsData(updatedData);
    updateFirestore({ journeyData: updatedData });
  }

  const handleJourneyComplete = (finalData: PassionData[]) => {
    setPassionsData(finalData);
    setStep("results");
    updateFirestore({ journeyData: finalData, currentStation: "results" });
  };

  const handleResultsCalculated = (results: RankPassionsOutput) => {
    setResultsData(results);
    updateFirestore({ resultsData: results });
  }

  const headerContent = {
    ar: { title: "مسار الشغف", home: "الصفحة الرئيسية", admin: "لوحة التحكم" },
    en: { title: "Passion Path", home: "Home", admin: "Admin" }
  }
  const hc = headerContent[language];

  return (
    <div className="min-h-screen bg-background text-foreground">
        <AlertDialog open={showContinueDialog} onOpenChange={setShowContinueDialog}>
            <AlertDialogContent dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <AlertDialogHeader>
                    <AlertDialogTitle>{c.title}</AlertDialogTitle>
                    <AlertDialogDescription>{c.description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleStartNewSession}>{c.startNew}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleContinueSession}>{c.continue}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

      <header className="py-4 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" passHref>
            <h1 className="text-2xl font-headline font-bold text-primary">
              {hc.title}
            </h1>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/admin" passHref>
                <Button variant="ghost">{hc.admin}</Button>
            </Link>
            <Link href="/" passHref>
                <Button variant="ghost">{hc.home}</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {step === "loading" && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <h2 className="text-2xl font-headline text-muted-foreground">{c.loading}</h2>
            </div>
        )}
        {step === "passions" && (
          <PassionForm onSubmit={handlePassionsSubmit} />
        )}
        {step === "journey" && passionsData.length > 0 && (
          <JourneyNavigator
            initialPassions={passionsData}
            onComplete={handleJourneyComplete}
            onDataChange={handleJourneyUpdate}
          />
        )}
        {step === "results" && passionsData.length > 0 && (
            <ResultsDisplay 
                passions={passionsData}
                initialResults={resultsData}
                onResultsCalculated={handleResultsCalculated}
            />
        )}
      </main>
    </div>
  );
}
