"use client";

import { useState } from "react";
import type { PassionData } from "@/lib/types";
import { PassionForm } from "@/components/journey/PassionForm";
import { JourneyNavigator } from "@/components/journey/JourneyNavigator";
import { ResultsDisplay } from "@/components/journey/ResultsDisplay";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function JourneyPage() {
  const [step, setStep] = useState<"passions" | "journey" | "results">("passions");
  const [passionsData, setPassionsData] = useState<PassionData[]>([]);

  const handlePassionsSubmit = (passions: { name: string }[]) => {
    const initialData: PassionData[] = passions.map((p, index) => ({
      id: `passion-${index}`,
      name: p.name,
      purpose: [
        { id: "purpose-0", text: "", weight: "" },
        { id: "purpose-1", text: "", weight: "" },
        { id: "purpose-2", text: "", weight: "" },
      ],
      power: "",
      proof: "",
      problems: "",
      possibilities: "",
      suggestedSolutions: [],
    }));
    setPassionsData(initialData);
    setStep("journey");
  };
  
  const handleJourneyComplete = (finalData: PassionData[]) => {
    setPassionsData(finalData);
    setStep("results");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="py-4 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" passHref>
            <h1 className="text-2xl font-headline font-bold text-primary">
              Passion Path
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
        {step === "journey" && (
          <JourneyNavigator
            initialPassions={passionsData}
            onComplete={handleJourneyComplete}
          />
        )}
        {step === "results" && <ResultsDisplay passions={passionsData} />}
      </main>
    </div>
  );
}
