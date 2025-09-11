
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { PassionData, UserData } from "@/lib/types";
import type { RankPassionsOutput } from "@/ai/flows/rank-passions";
import { PassionForm } from "@/components/journey/PassionForm";
import { JourneyNavigator } from "@/components/journey/JourneyNavigator";
import { ResultsDisplay } from "@/components/journey/ResultsDisplay";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { Loader2, LogOut, User as UserIcon } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfileDialog } from "@/components/journey/UserProfileDialog";
import Image from "next/image";
import { cn } from "@/lib/utils";

const loadingContent = {
    ar: {
        loading: "جاري تحميل رحلتك...",
        noUser: "لم تقم بتسجيل الدخول. سيتم توجيهك لصفحة التسجيل.",
        exitWarning: {
            title: "هل أنت متأكد من رغبتك في الخروج؟",
            description: "إذا خرجت الآن، قد لا يتم حفظ تقدمك الحالي. هذه الرحلة مهمة لمستقبلك.",
            cancel: "إلغاء",
            confirm: "تأكيد الخروج"
        }
    },
    en: {
        loading: "Loading your journey...",
        noUser: "You are not logged in. Redirecting to sign in page.",
        exitWarning: {
            title: "Are you sure you want to exit?",
            description: "If you exit now, your current progress might not be saved. This journey is important for your future.",
            cancel: "Cancel",
            confirm: "Confirm Exit"
        }
    }
}

export default function JourneyPage() {
  const [step, setStep] = useState<"loading" | "passions" | "journey" | "results">("loading");
  const [passionsData, setPassionsData] = useState<PassionData[]>([]);
  const [resultsData, setResultsData] = useState<RankPassionsOutput | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
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
            setUserData(fetchedUserData);
            
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
            if (currentStep === 'results' || (resultsData && resultsData.rankedPassions.length > 0)) {
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

  const updateFirestore = async (data: Partial<UserData>) => {
    if (!user) return;
    try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
            ...data,
            lastUpdated: serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error("Error updating document: ", error);
    }
  };

  const handlePassionsSubmit = (passions: { name: string }[]) => {
    const initialData: PassionData[] = passions.map((p, index) => ({
      id: `passion-${index}`,
      name: p.name,
      purpose: [{id: '1', text: '', weight: 0}, {id: '2', text: '', weight: 0}, {id: '3', text: '', weight: 0}],
      power: [{id: '1', text: '', weight: 0}, {id: '2', text: '', weight: 0}, {id: '3', text: '', weight: 0}],
      proof: [{id: '1', text: '', weight: 0}, {id: '2', text: '', weight: 0}, {id: '3', text: '', weight: 0}],
      problems: [{id: '1', text: '', weight: 0}, {id: '2', text: '', weight: 0}, {id: '3', text: '', weight: 0}],
      possibilities: [{id: '1', text: '', weight: 0}, {id: '2', text: '', weight: 0}, {id: '3', text: '', weight: 0}],
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

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/');
  };

  const headerContent = {
    ar: { title: "مسار الشغف", home: "الصفحة الرئيسية", signOut: "تسجيل الخروج", profile: "الملف الشخصي" },
    en: { title: "Passion Path", home: "Home", signOut: "Sign Out", profile: "Profile" }
  }
  const hc = headerContent[language];

  const ExitWarningDialog = ({ children }: { children: React.ReactNode }) => (
    <AlertDialog>
        <AlertDialogTrigger asChild>
            {children}
        </AlertDialogTrigger>
        <AlertDialogContent dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <AlertDialogHeader>
                <AlertDialogTitle>{c.exitWarning.title}</AlertDialogTitle>
                <AlertDialogDescription>{c.exitWarning.description}</AlertDialogDescription>
            </AlertDialogHeader>
            <div className="w-full aspect-video rounded-lg overflow-hidden border shadow-inner">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/Fzzs5vrE5e0"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <AlertDialogFooter>
                <AlertDialogCancel>{c.exitWarning.cancel}</AlertDialogCancel>
                <AlertDialogAction onClick={() => router.push('/')}>
                    {c.exitWarning.confirm}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="py-4 border-b">
        <div className="container mx-auto flex justify-between items-center">
        <ExitWarningDialog>
            <div className="relative h-10 w-40 cursor-pointer">
              <Image src="https://i.suar.me/1AxXY/l" alt="Passion Path Logo" fill style={{ objectFit: 'contain' }}/>
            </div>
          </ExitWarningDialog>
          <div className="flex items-center gap-4">
             {user && userData && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="cursor-pointer h-9 w-9">
                            <AvatarImage src={user.photoURL || undefined} />
                            <AvatarFallback>
                                {userData.name ? userData.name.charAt(0).toUpperCase() : <UserIcon/>}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                        <DropdownMenuLabel>
                            <div className="font-normal text-sm text-muted-foreground">{user.email}</div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <UserProfileDialog userData={userData}>
                           <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <UserIcon className={cn("h-4 w-4", language === 'ar' ? "ml-2" : "mr-2")} />
                                <span>{hc.profile}</span>
                           </DropdownMenuItem>
                        </UserProfileDialog>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                            <LogOut className={cn("h-4 w-4", language === 'ar' ? "ml-2" : "mr-2")} />
                            <span>{hc.signOut}</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
             )}
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
