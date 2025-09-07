"use client";

import { useState, useEffect } from "react";
import type { PassionData, FieldItem } from "@/lib/types";
import { rankPassions, RankPassionsInput, RankPassionsOutput } from "@/ai/flows/rank-passions";
import { generateDetailedReport, GenerateDetailedReportInput } from "@/ai/flows/generate-detailed-report";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Award, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useLanguage } from "@/context/language-context";
import { content } from "@/lib/content";

interface ResultsDisplayProps {
  passions: PassionData[];
  initialResults: RankPassionsOutput | null;
  onResultsCalculated: (results: RankPassionsOutput) => void;
}

const ensureArray = (field: any): FieldItem[] => {
    if (Array.isArray(field)) {
      return field.map(item => ({
        id: item?.id || Math.random().toString(),
        text: typeof item?.text === 'string' ? item.text : '',
        weight: ['high', 'medium', 'low', ''].includes(item?.weight) ? item.weight : ''
      })).filter(item => item.text);
    }
    return [];
};


export function ResultsDisplay({ passions, initialResults, onResultsCalculated }: ResultsDisplayProps) {
  const [rankedPassions, setRankedPassions] = useState<RankPassionsOutput | null>(initialResults);
  const [loading, setLoading] = useState(!initialResults);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const { language } = useLanguage();
  const c = content[language].results;

  useEffect(() => {
    const getRanking = async () => {
      // If we already have the results (from props/localStorage), don't fetch again.
      if (initialResults) {
        setRankedPassions(initialResults);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      try {
        const validatedPassions = passions.map(p => ({
            passion: p.name,
            purpose: ensureArray(p.purpose),
            power: ensureArray(p.power),
            proof: ensureArray(p.proof),
            problems: ensureArray(p.problems),
            possibilities: ensureArray(p.possibilities),
        }));

        const input: RankPassionsInput = { passions: validatedPassions };
        
        const result = await rankPassions(input);
        
        result.rankedPassions.sort((a, b) => b.score - a.score);
        
        setRankedPassions(result);
        onResultsCalculated(result); // Pass the newly calculated results up to the parent

      } catch (e) {
        console.error(e);
        setError(c.error);
      } finally {
        setLoading(false);
      }
    };

    getRanking();
  }, [passions, c.error, language, initialResults, onResultsCalculated]);

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    try {
        const doc = new jsPDF();
        
        const reportPassions = passions.map(p => ({
          ...p,
          purpose: ensureArray(p.purpose),
          power: ensureArray(p.power),
          proof: ensureArray(p.proof),
          problems: ensureArray(p.problems),
          possibilities: ensureArray(p.possibilities),
        }));

        const input: GenerateDetailedReportInput = { passions: reportPassions, language };
        const { report } = await generateDetailedReport(input);
        
        // This is a workaround for jsPDF's lack of proper UTF-8 support for Arabic.
        // We can use a font that supports it, or manually handle it.
        // For simplicity, we are now relying on jspdf-autotable's font handling.
        
        doc.setR2L(language === 'ar');

        doc.setFontSize(22);
        doc.text(c.reportTitle, 105, 20, { align: 'center' });
        
        doc.setFontSize(12);
        
        // Let autotable handle the content wrapping and styling
        autoTable(doc, {
            body: [[report]],
            startY: 30,
            theme: 'plain',
            styles: {
                font: 'Helvetica', // A standard font
                halign: language === 'ar' ? 'right' : 'left',
                cellPadding: 2,
                fontSize: 10,
            },
            didParseCell: function (data) {
                // You might need custom logic for complex text, but autotable handles basic RTL well
                if (language === 'ar') {
                    // a more reliable way to reverse for display in some PDF viewers
                    data.cell.text = data.cell.text[0].split('\n').map(line => line.split(' ').reverse().join(' ')).join('\n');
                }
            }
        });
        
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
    <div className="w-full max-w-4xl mx-auto space-y-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="text-center space-y-4">
            <h1 className="text-4xl font-headline font-bold text-primary">{c.title}</h1>
            <p className="text-lg text-muted-foreground">{c.subtitle}</p>
            <Button onClick={handleDownloadReport} disabled={isDownloading}>
              {isDownloading ? (
                <Loader2 className={language === 'ar' ? "ml-2 h-4 w-4 animate-spin" : "mr-2 h-4 w-4 animate-spin"} />
              ) : (
                <Download className={language === 'ar' ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
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
              <p className="text-muted-foreground whitespace-pre-wrap">{passion.reasoning}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
