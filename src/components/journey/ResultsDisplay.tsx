
"use client";

import { useState, useEffect } from "react";
import type { PassionData, FieldItem } from "@/lib/types";
import { rankPassions, RankPassionsInput, RankPassionsOutput } from "@/ai/flows/rank-passions";
import { generateDetailedReport, GenerateDetailedReportInput } from "@/ai/flows/generate-detailed-report";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Award, Download, CheckCircle, FileText, Smartphone, Laptop, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/language-context";
import { content } from "@/lib/content";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { cn } from "@/lib/utils";
import Confetti from "react-confetti";


interface ResultsDisplayProps {
  passions: PassionData[];
  initialResults: RankPassionsOutput | null;
  onResultsCalculated: (results: RankPassionsOutput) => void;
}

const filterRatedItems = (items: FieldItem[] | undefined): FieldItem[] => {
    if (!Array.isArray(items)) {
        return [];
    }
    return items.filter(item => item.text && item.weight > 0);
};

const downloadContent = {
    ar: {
        certificateDialog: {
            title: "تنزيل شهادة الإنجاز",
            description: "أدخل اسمك باللغة الإنجليزية ليتم وضعه على شهادة إتمام رحلة اكتشاف الشغف.",
            nameLabel: "الاسم (باللغة الإنجليزية)",
            namePlaceholder: "Your Name",
            downloadButton: "تنزيل الشهادة",
            cancel: "إلغاء",
            error: "حدث خطأ أثناء إنشاء الشهادة. الرجاء المحاولة مرة أخرى.",
        },
        reportDialog: {
            title: "تنبيه قبل تنزيل التقرير",
            description: "سيتم تنزيل التقرير كملف نصي (.txt). قد تحتاج إلى تطبيق معين لفتحه على هاتفك.",
            android: "لمستخدمي أندرويد، نوصي بتنزيل تطبيق بسيط لعرض الملفات النصية.",
            ios: "لمستخدمي آيفون، يمكنك استخدام تطبيق Files المدمج في النظام لفتح التقرير.",
            computer: "إذا كنت تستخدم جهاز كمبيوتر، سيفتح الملف بسهولة.",
            androidLink: "تنزيل Text Viewer",
            continue: "تنزيل التقرير",
            cancel: "إلغاء",
            error: "حدث خطأ أثناء إنشاء التقرير. الرجاء المحاولة مرة أخرى.",
        }
    },
    en: {
        certificateDialog: {
            title: "Download Certificate of Completion",
            description: "Enter your name in English to be placed on your passion discovery journey certificate.",
            nameLabel: "Name (in English)",
            namePlaceholder: "Your Name",
            downloadButton: "Download Certificate",
            cancel: "Cancel",
            error: "An error occurred while generating the certificate. Please try again.",
        },
        reportDialog: {
            title: "Heads-up Before Downloading Report",
            description: "The report will be downloaded as a text file (.txt). You might need a specific app to open it on your phone.",
            android: "For Android users, we recommend downloading a simple app to view text files.",
            ios: "For iPhone users, you can use the built-in Files app to open the report.",
            computer: "If you're on a computer, the file will open easily.",
            androidLink: "Download Text Viewer",
            continue: "Download Report",
            cancel: "Cancel",
            error: "An error occurred while generating the report. Please try again.",
        }
    }
}


export function ResultsDisplay({ passions, initialResults, onResultsCalculated }: ResultsDisplayProps) {
  const [rankedPassions, setRankedPassions] = useState<RankPassionsOutput | null>(initialResults);
  const [loading, setLoading] = useState(!initialResults);
  const [error, setError] = useState<string | null>(null);
  
  const [isDownloadingCert, setIsDownloadingCert] = useState(false);
  const [isDownloadingReport, setIsDownloadingReport] = useState(false);
  
  const [showCertDialog, setShowCertDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);

  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const [userName, setUserName] = useState("");
  const { language } = useLanguage();
  const c = content[language].results;
  const dc = downloadContent[language];

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

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
            purpose: filterRatedItems(p.purpose),
            power: filterRatedItems(p.power),
            proof: filterRatedItems(p.proof),
            problems: filterRatedItems(p.problems),
            possibilities: filterRatedItems(p.possibilities),
        }));

        const input: RankPassionsInput = { passions: validatedPassions, language };
        
        const result = await rankPassions(input);
        
        result.rankedPassions.sort((a, b) => b.score - a.score);
        
        setRankedPassions(result);
        onResultsCalculated(result);

        // Trigger confetti
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000); // Hide confetti after 4 seconds

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
    setIsDownloadingReport(true);
    try {
        const reportPassions = passions.map(p => ({
          ...p,
          purpose: filterRatedItems(p.purpose),
          power: filterRatedItems(p.power),
          proof: filterRatedItems(p.proof),
          problems: filterRatedItems(p.problems),
          possibilities: filterRatedItems(p.possibilities),
        }));

        const input: GenerateDetailedReportInput = { passions: reportPassions, language };
        const { report } = await generateDetailedReport(input);

        const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Passion_Path_Report.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
    } catch (e) {
        console.error(e);
        alert(dc.reportDialog.error);
    } finally {
        setIsDownloadingReport(false);
        setShowReportDialog(false);
    }
  };

  const handleDownloadCertificate = async () => {
    if (!userName.trim()) {
        alert(dc.certificateDialog.namePlaceholder);
        return;
    }
    setIsDownloadingCert(true);

    try {
        const certDoc = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: 'a4'
        });

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = "https://i.suar.me/j5GBz/l";
        
        img.onload = () => {
            const pageWidth = certDoc.internal.pageSize.getWidth();
            const pageHeight = certDoc.internal.pageSize.getHeight();
            certDoc.addImage(img, 'PNG', 0, 0, pageWidth, pageHeight);

            certDoc.setFontSize(30);
            certDoc.setTextColor('#000000');
            certDoc.setFont('helvetica', 'bold');
            certDoc.text(userName, pageWidth / 2, pageHeight / 2 + 20, { align: 'center' });

            certDoc.save('Passion_Path_Certificate.pdf');
            setIsDownloadingCert(false);
            setShowCertDialog(false);
        };
        img.onerror = () => {
             alert(dc.certificateDialog.error);
             setIsDownloadingCert(false);
        }

    } catch (e) {
        console.error(e);
        alert(dc.certificateDialog.error);
        setIsDownloadingCert(false);
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
        {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={400} />}
        {/* Certificate Download Dialog */}
        <Dialog open={showCertDialog} onOpenChange={setShowCertDialog}>
            <DialogContent dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Award className="text-accent"/>
                        {dc.certificateDialog.title}
                    </DialogTitle>
                    <DialogDescription>
                        {dc.certificateDialog.description}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-2">
                    <Label htmlFor="name">{dc.certificateDialog.nameLabel}</Label>
                    <Input 
                        id="name" 
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder={dc.certificateDialog.namePlaceholder}
                        dir="ltr"
                    />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost">{dc.certificateDialog.cancel}</Button>
                    </DialogClose>
                    <Button onClick={handleDownloadCertificate} disabled={isDownloadingCert}>
                         {isDownloadingCert && <Loader2 className={language === 'ar' ? "ml-2 h-4 w-4 animate-spin" : "mr-2 h-4 w-4 animate-spin"} />}
                         {dc.certificateDialog.downloadButton}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* Report Download Alert Dialog */}
        <AlertDialog open={showReportDialog} onOpenChange={setShowReportDialog}>
            <AlertDialogContent dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <AlertDialogHeader className={cn(language === 'ar' ? "text-right" : "text-left")}>
                    <AlertDialogTitle className="flex items-center gap-2">
                       <AlertTriangle className="text-destructive"/> {dc.reportDialog.title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className={cn(language === 'ar' ? "text-right" : "text-left")}>{dc.reportDialog.description}</AlertDialogDescription>
                </AlertDialogHeader>
                <div className={cn("space-y-4 text-sm", language === 'ar' ? "text-right" : "text-left")}>
                    <div className="flex items-start gap-3">
                        <Smartphone className="h-5 w-5 mt-0.5 text-muted-foreground" />
                        <div className="flex-grow">
                            <p><b>{language === 'ar' ? "لمستخدمي أندرويد:" : "For Android Users:"}</b> {dc.reportDialog.android}</p>
                            <a href="https://play.google.com/store/apps/details?id=com.panagola.app.textviewer" target="_blank" rel="noopener noreferrer" className="text-primary underline">{dc.reportDialog.androidLink}</a>
                            <p className="mt-2"><b>{language === 'ar' ? "لمستخدمي آيفون:" : "For iPhone Users:"}</b> {dc.reportDialog.ios}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Laptop className="h-5 w-5 text-muted-foreground" />
                        <p>{dc.reportDialog.computer}</p>
                    </div>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>{dc.reportDialog.cancel}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDownloadReport} disabled={isDownloadingReport}>
                        {isDownloadingReport && <Loader2 className={language === 'ar' ? "ml-2 h-4 w-4 animate-spin" : "mr-2 h-4 w-4 animate-spin"} />}
                        {dc.reportDialog.continue}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <div className="text-center space-y-4">
            <h1 className="text-4xl font-headline font-bold text-primary">{c.title}</h1>
            <p className="text-lg text-muted-foreground">{c.subtitle}</p>
            <div className="flex justify-center gap-4">
                <Button onClick={() => setShowReportDialog(true)} variant="outline">
                    <FileText className={language === 'ar' ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
                    {c.downloadReportButton}
                </Button>
                <Button onClick={() => setShowCertDialog(true)}>
                    <Award className={language === 'ar' ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />
                    {c.downloadCertificateButton}
                </Button>
            </div>
        </div>

      <div className="space-y-6">
        {rankedPassions?.rankedPassions.map((passion, index) => (
          <Card key={passion.passion} className={`shadow-md transition-all hover:shadow-xl ${index === 0 ? 'border-accent border-2' : 'hover:border-accent/50'}`}>
            <CardHeader className="flex flex-row items-start gap-4">
                <div className="flex-shrink-0">
                    <Badge className={`text-3xl font-bold h-16 w-16 rounded-full flex items-center justify-center ${index === 0 ? 'bg-accent text-accent-foreground' : 'bg-primary/20 text-primary'}`}>
                        {index + 1}
                    </Badge>
                </div>
                <div className="flex-grow">
                    <CardTitle className="text-2xl font-headline">{passion.passion}</CardTitle>
                    <CardDescription className="font-bold text-lg text-foreground">
                        {c.score}: {passion.score}
                    </CardDescription>
                </div>
                {index === 0 && (
                    <div className="flex-shrink-0">
                        <div className="flex items-center gap-2 text-accent font-bold">
                             <CheckCircle className="w-8 h-8"/>
                             <span>{c.topPassion}</span>
                        </div>
                    </div>
                )}
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

    