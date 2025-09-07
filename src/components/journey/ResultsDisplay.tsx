"use client";

import { useState, useEffect } from "react";
import type { PassionData } from "@/lib/types";
import { rankPassions } from "@/ai/flows/rank-passions";
import type { RankPassionsInput, RankPassionsOutput } from "@/ai/flows/rank-passions";
import { generateDetailedReport } from "@/ai/flows/generate-detailed-report";
import type { GenerateDetailedReportInput } from "@/ai/flows/generate-detailed-report";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Award, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { useLanguage } from "@/context/language-context";
import { content } from "@/lib/content";

interface ResultsDisplayProps {
  passions: PassionData[];
}

export function ResultsDisplay({ passions }: ResultsDisplayProps) {
  const [rankedPassions, setRankedPassions] = useState<RankPassionsOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const { language } = useLanguage();
  const c = content[language].results;

  useEffect(() => {
    const getRanking = async () => {
      setLoading(true);
      setError(null);
      try {
        const purposeWeightMap = { high: 'high', medium: 'medium', low: 'low', '': 'low' } as const;
        
        const input: RankPassionsInput = {
          passions: passions.map(p => ({
            passion: p.name,
            purpose: p.purpose.map(pur => pur.text).filter(t => t),
            purposeWeights: p.purpose.map(pur => purposeWeightMap[pur.weight]).filter(w => w),
            power: p.power.map(item => item.text).filter(t => t).join(', '),
            proof: p.proof.map(item => item.text).filter(t => t).join(', '),
            problems: p.problems.map(item => item.text).filter(t => t).join(', '),
            possibilities: p.possibilities.map(item => item.text).filter(t => t).join(', '),
          }))
        };
        
        const result = await rankPassions(input);
        
        result.rankedPassions.sort((a, b) => b.score - a.score);
        
        setRankedPassions(result);

      } catch (e) {
        console.error(e);
        setError(c.error);
      } finally {
        setLoading(false);
      }
    };

    getRanking();
  }, [passions, c.error]);

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    try {
        const doc = new jsPDF();
        
        // Add Zain font
        const font = await fetch('/Zain-Regular.ttf').then(res => res.arrayBuffer());
        const fontBase64 = btoa(new Uint8Array(font).reduce((data, byte) => data + String.fromCharCode(byte), ''));
        doc.addFileToVFS("Zain-Regular.ttf", fontBase64);
        doc.addFont("Zain-Regular.ttf", "Zain", "normal");
        doc.setFont("Zain");

        doc.setR2L(true);

        const input: GenerateDetailedReportInput = { passions, language };
        const { report } = await generateDetailedReport(input);
        
        doc.setFontSize(22);
        doc.text(c.reportTitle, 105, 20, { align: 'center' });
        
        doc.setFontSize(12);
        const splitText = doc.splitTextToSize(report, 180);
        doc.text(splitText, 105, 35, { align: 'center' });
        
        doc.save("Passion_Path_Report.pdf");

    } catch (e) {
      console.error(e);
      alert(c.reportError);
    } finally {
      setIsDownloading(false);
    }
  };
  
    if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <h2 className="text-2xl font-headline text-muted-foreground">{c.loading}</h2>
        <p className="text-center">{c.loadingSubtitle}</p>
      </div>
    );
  }

  if (error) {
    return (
        <Card className="w-full max-w-2xl mx-auto bg-destructive/10 border-destructive">
            <CardHeader>
                <CardTitle>{c.errorTitle}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{error}</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
            <h1 className="text-4xl font-headline font-bold text-primary">{c.title}</h1>
            <p className="text-lg text-muted-foreground">{c.subtitle}</p>
            <Button onClick={handleDownloadReport} disabled={isDownloading}>
              {isDownloading ? (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="ml-2 h-4 w-4" />
              )}
              {isDownloading ? c.downloading : c.downloadButton}
            </Button>
        </div>
      <div className="space-y-6">
        {rankedPassions?.rankedPassions.map((passion, index) => (
          <Card key={passion.passion} className="shadow-md transition-all hover:shadow-xl hover:border-accent/50">
            <CardHeader className="flex flex-row items-start gap-4">
                <div className="flex-shrink-0">
                    <Badge className="text-3xl font-bold h-16 w-16 rounded-full flex items-center justify-center bg-accent text-accent-foreground">
                        {index + 1}
                    </Badge>
                </div>
                <div className="flex-grow">
                    <CardTitle className="text-2xl font-headline">{passion.passion}</CardTitle>
                    <CardDescription>{c.score}: {passion.score}</CardDescription>
                </div>
                <div className="flex-shrink-0">
                    <Award className="w-8 h-8 text-yellow-500"/>
                </div>
            </CardHeader>
            <CardContent>
              <h4 className="font-bold mb-2">{c.reasoning}:</h4>
              <p className="text-muted-foreground">{passion.reasoning}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
