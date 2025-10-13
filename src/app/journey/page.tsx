"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { PassionData, UserData } from "@/lib/types";
import type { RankPassionsOutput } from "@/ai/flows/rank-passions";
import { PassionForm } from "@/components/journey/PassionForm";
import { JourneyNavigator } from "@/components/journey/JourneyNavigator";
import { ResultsDisplay } from "@/components/journey/ResultsDisplay";
import { useLanguage } from "@/context/language-context";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { AppHeader } from "@/components/layout/Header";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

const loadingContent = {
    ar: {
        loading: "جاري تحميل رحلتك...",
        noUser: "لم تقم بتسجيل الدخول. سيتم توجيهك لصفحة التسجيل.",
    },
    en: {
        loading: "Loading your journey...",
        noUser: "You are not logged in. Redirecting to sign in page.",
    }
}

export default function JourneyPage() {
  const [step, setStep] = useState<"loading" | "passions" | "journey" | "results">("loading");
  const [passionsData, setPassionsData] = useState<PassionData[]>([]);
  const [resultsData, setResultsData] = useState<RankPassionsOutput | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const { language } = useLanguage();
  const router = useRouter();
  const c = loadingContent[language];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
            setUser(currentUser);
            loadUserData(currentUser.uid);
        } else {
            console.warn(c.noUser);
            router.push('/auth/user/signin?redirect=/journey');
        }
    });
    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, c.noUser]);


  const loadUserData = async (currentUserId: string) => {
    setStep("loading");
    try {
        const userDocRef = doc(db, "users", currentUserId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const fetchedUserData = userDoc.data() as UserData;
            
            // Check if user has completed onboarding
            if (!fetchedUserData.name || !fetchedUserData.whatsapp) {
                router.push('/journey/onboarding');
                return;
            }

            const journeyData = fetchedUserData.journeyData || [];
            const resultsData = fetchedUserData.resultsData || null;
            let currentStep = (fetchedUserData.currentStation as "passions" | "journey" | "results") || "passions";

            setPassionsData(journeyData);
            setResultsData(resultsData);

            // Logic to determine the correct step
            if (currentStep === 'results' && resultsData && resultsData.rankedPassions.length > 0) {
                setStep('results');
            } else if (currentStep === 'journey' && journeyData.length > 0) {
                setStep('journey');
            } else {
                setStep('passions');
            }
        } else {
            // New user, redirect to onboarding
            router.push('/journey/onboarding');
        }
    } catch (error) {
        console.error("Failed to load data from Firestore", error);
        // Maybe show an error message before redirecting
        router.push('/');
    }
  };

  const updateFirestore = (data: Partial<UserData>) => {
    if (!user) return;
    
    const userDocRef = doc(db, "users", user.uid);
    const dataToUpdate = {
        ...data,
        lastUpdated: serverTimestamp()
    };

    // NO await here. Chain the .catch() block.
    setDoc(userDocRef, dataToUpdate, { merge: true })
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'update',
                requestResourceData: dataToUpdate,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
  };

  const handlePassionsSubmit = (passions: { name: string }[]) => {
    const initialData: PassionData[] = passions.map((p, index) => ({
      id: `passion-${index}`,
      name: p.name,
      purpose: [],
      power: [],
      proof: [],
      problems: [],
      possibilities: [],
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader />
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
        {step === "results" && passionsData.length > 0 && user && (
            <ResultsDisplay 
                passions={passionsData}
                initialResults={resultsData}
                onResultsCalculated={handleResultsCalculated}
                userId={user.uid}
            />
        )}
      </main>
    </div>
  );
}
