"use client";

import { useState, useEffect } from "react";
import type { PassionData, FieldItem } from "@/lib/types";
import { rankPassions, RankPassionsInput, RankPassionsOutput } from "@/ai/flows/rank-passions";
import { generateDetailedReport, GenerateDetailedReportInput } from "@/ai/flows/generate-detailed-report";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Award, Download, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/language-context";
import { content } from "@/lib/content";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import jsPDF from "jspdf";

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

const downloadContent = {
    ar: {
        dialogTitle: "التقرير النهائي والشهادة",
        dialogDescription: "أوشكت رحلتك على الانتهاء! أدخل اسمك باللغة الإنجليزية ليتم وضعه على شهادة إتمام رحلة اكتشاف الشغف.",
        nameLabel: "الاسم (باللغة الإنجليزية)",
        namePlaceholder: "Your Name",
        downloadButton: "تنزيل التقرير والشهادة",
        cancel: "إلغاء",
        reportError: "حدث خطأ أثناء إنشاء التقرير. الرجاء المحاولة مرة أخرى.",
        certificateError: "حدث خطأ أثناء إنشاء الشهادة. الرجاء المحاولة مرة أخرى.",
    },
    en: {
        dialogTitle: "Final Report & Certificate",
        dialogDescription: "Your journey is almost complete! Enter your name in English to be placed on your passion discovery journey certificate.",
        nameLabel: "Name (in English)",
        namePlaceholder: "Your Name",
        downloadButton: "Download Report & Certificate",
        cancel: "Cancel",
        reportError: "An error occurred while generating the report. Please try again.",
        certificateError: "An error occurred while generating the certificate. Please try again.",
    }
}


export function ResultsDisplay({ passions, initialResults, onResultsCalculated }: ResultsDisplayProps) {
  const [rankedPassions, setRankedPassions] = useState<RankPassionsOutput | null>(initialResults);
  const [loading, setLoading] = useState(!initialResults);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [userName, setUserName] = useState("");
  const { language } = useLanguage();
  const c = content[language].results;
  const dc = downloadContent[language];

  useEffect(() => {
    const getRanking = async () => {
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

        const input: RankPassionsInput = { passions: validatedPassions, language };
        
        const result = await rankPassions(input);
        
        result.rankedPassions.sort((a, b) => b.score - a.score);
        
        setRankedPassions(result);
        onResultsCalculated(result);

      } catch (e) {
        console.error(e);
        setError(c.error);
      } finally {
        setLoading(false);
      }
    };

    getRanking();
  }, [passions, c.error, language, initialResults, onResultsCalculated]);

  const handleDownload = async () => {
    if (!userName.trim()) {
        alert("Please enter your name.");
        return;
    }
    setIsDownloading(true);

    // 1. Generate and download text report
    try {
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
        
        const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Passion_Path_Report.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert(dc.reportError);
    }

    // 2. Generate and download PDF certificate
    try {
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: 'a4'
        });

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = "https://i.suar.me/j5GBz/l";
        
        img.onload = () => {
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            doc.addImage(img, 'PNG', 0, 0, pageWidth, pageHeight);

            doc.setFontSize(30);
            doc.setTextColor('#000000');
            doc.setFont('helvetica', 'bold');
            doc.text(userName, pageWidth / 2, pageHeight / 2 + 20, { align: 'center' });

            doc.save('Passion_Path_Certificate.pdf');
            setIsDownloading(false);
            setShowDownloadDialog(false);
        };
        img.onerror = () => {
             alert(dc.certificateError);
             setIsDownloading(false);
        }

    } catch (e) {
        console.error(e);
        alert(dc.certificateError);
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
        <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
            <DialogContent dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CheckCircle className="text-accent"/>
                        {dc.dialogTitle}
                    </DialogTitle>
                    <DialogDescription>
                        {dc.dialogDescription}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-2">
                    <Label htmlFor="name">{dc.nameLabel}</Label>
                    <Input 
                        id="name" 
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder={dc.namePlaceholder}
                        dir="ltr"
                    />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost">{dc.cancel}</Button>
                    </DialogClose>
                    <Button onClick={handleDownload} disabled={isDownloading}>
                         {isDownloading && <Loader2 className={language === 'ar' ? "ml-2 h-4 w-4 animate-spin" : "mr-2 h-4 w-4 animate-spin"} />}
                         {dc.downloadButton}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>


        <div className="text-center space-y-4">
            <h1 className="text-4xl font-headline font-bold text-primary">{c.title}</h1>
            <p className="text-lg text-muted-foreground">{c.subtitle}</p>
            <Button onClick={() => setShowDownloadDialog(true)}>
                <Download className={language === 'ar' ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
                {c.downloadButton}
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
