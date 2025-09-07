"use client";

import { useState, useEffect } from "react";
import type { PassionData } from "@/lib/types";
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

const JOURNEY_STORAGE_KEY = "passionJourneyData";
const JOURNEY_STEP_KEY = "passionJourneyStep";

const dialogContent = {
    ar: {
        title: "لديك جلسة سابقة",
        description: "لقد وجدنا بيانات محفوظة من رحلتك الأخيرة. هل تود المتابعة من حيث توقفت، أم بدء رحلة جديدة؟",
        continue: "المتابعة",
        startNew: "بدء رحلة جديدة"
    },
    en: {
        title: "You have a previous session",
        description: "We found saved data from your last journey. Would you like to continue where you left off, or start a new journey?",
        continue: "Continue",
        startNew: "Start New Journey"
    }
}


export default function JourneyPage() {
  const [step, setStep] = useState<"passions" | "journey" | "results">("passions");
  const [passionsData, setPassionsData] = useState<PassionData[]>([]);
  const [showContinueDialog, setShowContinueDialog] = useState(false);
  const { language } = useLanguage();
  const c = dialogContent[language];

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(JOURNEY_STORAGE_KEY);
      const savedStep = localStorage.getItem(JOURNEY_STEP_KEY);

      if (savedData && savedStep) {
        setShowContinueDialog(true);
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      // Clear potentially corrupted data
      localStorage.removeItem(JOURNEY_STORAGE_KEY);
      localStorage.removeItem(JOURNEY_STEP_KEY);
    }
  }, []);

  const handleContinueSession = () => {
    try {
        const savedData = localStorage.getItem(JOURNEY_STORAGE_KEY);
        const savedStep = localStorage.getItem(JOURNEY_STEP_KEY);
        if (savedData && savedStep) {
            setPassionsData(JSON.parse(savedData));
            setStep(savedStep as "passions" | "journey" | "results");
        }
    } catch (error) {
        console.error("Failed to load data from localStorage", error);
        handleStartNewSession(); // Start fresh if loading fails
    }
    setShowContinueDialog(false);
  };

  const handleStartNewSession = () => {
    try {
        localStorage.removeItem(JOURNEY_STORAGE_KEY);
        localStorage.removeItem(JOURNEY_STEP_KEY);
    } catch (error) {
        console.error("Failed to clear localStorage", error);
    }
    setPassionsData([]);
    setStep("passions");
    setShowContinueDialog(false);
  };


  const handlePassionsSubmit = (passions: { name: string }[]) => {
    const initialData: PassionData[] = passions.map((p, index) => ({
      id: `passion-${index}`,
      name: p.name,
      purpose: [{ id: `passion-${index}-purpose-0`, text: "", weight: "" }],
      power: [{ id: `passion-${index}-power-0`, text: "" }],
      proof: [{ id: `passion-${index}-proof-0`, text: "" }],
      problems: [{ id: `passion-${index}-problems-0`, text: "" }],
      possibilities: [{ id: `passion-${index}-possibilities-0`, text: "" }],
      suggestedSolutions: [],
    }));
    setPassionsData(initialData);
    setStep("journey");
    localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(initialData));
    localStorage.setItem(JOURNEY_STEP_KEY, "journey");
  };
  
  const handleJourneyUpdate = (updatedData: PassionData[]) => {
    setPassionsData(updatedData);
    localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(updatedData));
  }

  const handleJourneyComplete = (finalData: PassionData[]) => {
    setPassionsData(finalData);
    setStep("results");
    localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(finalData));
    localStorage.setItem(JOURNEY_STEP_KEY, "results");
  };

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
              مسار الشغف
            </h1>
          </Link>
          <Link href="/" passHref>
            <Button variant="ghost">الصفحة الرئيسية</Button>
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
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
        {step === "results" && passionsData.length > 0 && <ResultsDisplay passions={passionsData} />}
      </main>
    </div>
  );
}
