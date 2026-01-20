

"use client";

import { useState, useEffect, useRef } from "react";
import type { PassionData, FieldItem, UserData, RankPassionsOutput } from "@/lib/types";
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
import { cn } from "@/lib/utils";
import Confetti from "react-confetti";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Certificate } from "./Certificate";


const downloadContent = {
    ar: {
        certificateDialog: {
            title: "تنزيل شهادة الإنجاز",
            description: "أدخل اسمك ليتم وضعه على شهادة إتمام رحلة اكتشاف المفضلات. استخدم اسمك باللغة الإنجليزية للحصول على أفضل نتيجة.",
            nameLabel: "الاسم",
            namePlaceholder: "اسمك الكامل",
            downloadButton: "تنزيل الشهادة (PDF)",
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
            description: "Enter your name to be placed on your preference discovery journey certificate. Use your English name for best results.",
            nameLabel: "Name",
            namePlaceholder: "Your Full Name",
            downloadButton: "Download Certificate (PDF)",
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

const fallbackRankPassions = (passions: PassionData[], language: 'ar' | 'en'): RankPassionsOutput => {
    const c = content[language].results.fallback;

    const filterRatedItems = (items: FieldItem[] | undefined): FieldItem[] => {
        if (!Array.isArray(items)) {
            return [];
        }
        return items.filter(item => item.text && item.weight > 0);
    };

    const validatedPassions = passions.map(p => ({
        name: p.name,
        purpose: filterRatedItems(p.purpose),
        power: filterRatedItems(p.power),
        proof: filterRatedItems(p.proof),
        problems: filterRatedItems(p.problems),
        possibilities: filterRatedItems(p.possibilities),
    }));

    const calculateScore = (passion: { purpose: FieldItem[], power: FieldItem[], proof: FieldItem[], problems: FieldItem[], possibilities: FieldItem[] }): number => {
        let score = 0;
        const calculate = (items: FieldItem[], multiplier: 1 | -1) => {
            return items.reduce((acc, item) => {
                const weight = item.weight || 1;
                return acc + (weight * multiplier);
            }, 0);
        };

        score += calculate(passion.purpose, 1);
        score += calculate(passion.power, 1);
        score += calculate(passion.proof, 1);
        score += calculate(passion.possibilities, 1);
        score -= calculate(passion.problems, 1);
        
        return score;
    }

    const passionsWithScores = validatedPassions.map(p => ({
        ...p,
        score: calculateScore(p),
    }));

    passionsWithScores.sort((a, b) => b.score - a.score);

    const getTopItems = (items: FieldItem[], count = 1) => items.sort((a, b) => b.weight - a.weight).slice(0, count).map(i => i.text);

    const finalRankedPassions = passionsWithScores.map((p, index) => {
        const reasoningParts = [];
        
        // Purpose analysis
        const highPurpose = p.purpose.filter(i => i.weight >= 4);
        if (highPurpose.length > 0) {
            reasoningParts.push(c.reasoningTemplates.purpose(getTopItems(highPurpose)[0]));
        }

        // Power analysis
        const highPower = p.power.filter(i => i.weight >= 4);
        if (highPower.length > 0) {
            reasoningParts.push(c.reasoningTemplates.power(getTopItems(highPower)[0]));
        }

        // Proof analysis
        const highProof = p.proof.filter(i => i.weight >= 4);
        if (highProof.length > 0) {
            reasoningParts.push(c.reasoningTemplates.proof(getTopItems(highProof)[0]));
        }

        // Problems vs. Possibilities
        const problemScore = p.problems.reduce((acc, item) => acc + item.weight, 0);
        const possibilityScore = p.possibilities.reduce((acc, item) => acc + item.weight, 0);

        if (possibilityScore > problemScore) {
            reasoningParts.push(c.reasoningTemplates.possibilities);
        } else {
            const highProblem = p.problems.filter(i => i.weight >= 4);
            if (highProblem.length > 0) {
                reasoningParts.push(c.reasoningTemplates.problems(getTopItems(highProblem)[0]));
            }
        }
        
        // Final Summary
        if (p.score > 10) {
             reasoningParts.push(c.reasoningTemplates.summary.high);
        } else if (p.score < 5) {
             reasoningParts.push(c.reasoningTemplates.summary.low);
        } else {
             reasoningParts.push(c.reasoningTemplates.summary.medium);
        }
        
        // Add final advice based on rank
        let finalAdvice = "";
        if (index === 0) {
            finalAdvice = c.reasoningTemplates.finalAdvice.rank1;
        } else if (index === 1) {
            finalAdvice = c.reasoningTemplates.finalAdvice.rank2;
        } else if (index === 2) {
            finalAdvice = c.reasoningTemplates.finalAdvice.rank3;
        } else {
            finalAdvice = c.reasoningTemplates.finalAdvice.default;
        }
        reasoningParts.push(`\n${finalAdvice}`);


        return {
            passion: p.name,
            score: p.score,
            reasoning: reasoningParts.join("\n- "),
        };
    });

    return { rankedPassions: finalRankedPassions };
}


export function ResultsDisplay({ passions, initialResults, onResultsCalculated, userId }: { passions: PassionData[], initialResults: RankPassionsOutput | null, onResultsCalculated: (results: RankPassionsOutput) => void, userId: string }) {
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
  const [certificateId, setCertificateId] = useState("");
  const [passionInEnglish, setPassionInEnglish] = useState("");
  const { language } = useLanguage();
  const c = content[language].results;
  const dc = downloadContent[language];

  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserData = async () => {
        if (userId) {
            const userDoc = await getDoc(doc(db, "users", userId));
            if(userDoc.exists()){
                const userData = userDoc.data() as UserData;
                if(userData.name) {
                    setUserName(userData.name);
                }
                if(userData.shortId) {
                    setCertificateId(userData.shortId);
                } else {
                    const newShortId = userId.slice(0, 8).toUpperCase();
                    setCertificateId(newShortId);
                    await updateDoc(doc(db, "users", userId), { shortId: newShortId });
                }
            }
        }
    };
    fetchUserData();
  }, [userId]);


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
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 4000);
          return;
      }
      
      setLoading(true);
      setError(null);
      try {
        const result = fallbackRankPassions(passions, language);
        setRankedPassions(result);
        onResultsCalculated(result);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 8000);
      } catch (e: any) {
        setError(e.message || c.error);
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if(passions.length > 0){
        getRanking();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passions, language, onResultsCalculated]);

  const generateSimpleReport = (reportPassionsData: PassionData[]) => {
    let report = `${c.reportTitle}\n\n`;
    report += "==================================\n\n";
  
    reportPassionsData.forEach(passion => {
      report += `## ${passion.name}\n\n`;
  
      const renderSection = (title: string, items: FieldItem[] | undefined) => {
        if (items && items.length > 0) {
          report += `### ${title}\n`;
          items.forEach(item => {
            report += `- ${item.text} (Rating: ${item.weight}/5)\n`;
          });
          report += '\n';
        }
      };
  
      renderSection('Purpose', passion.purpose);
      renderSection('Power', passion.power);
      renderSection('Proof', passion.proof);
      renderSection('Problems', passion.problems);
      renderSection('Possibilities', passion.possibilities);
  
      if (passion.suggestedSolutions && passion.suggestedSolutions.length > 0) {
        report += `### Suggested Solutions\n`;
        passion.suggestedSolutions.forEach(solution => {
            report += `  - ${solution}\n`;
        });
        report += '\n';
      }
      report += "----------------------------------\n\n";
    });
  
    return report;
  };

  const handleDownloadReport = async () => {
    setIsDownloadingReport(true);
    try {
        const reportText = generateSimpleReport(passions);

        const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Preferences_Path_Report.txt';
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
    if (!certificateRef.current) {
        alert(dc.certificateDialog.error);
        return;
    }

    setIsDownloadingCert(true);
    try {
        const topPassion = rankedPassions?.rankedPassions[0]?.passion || "";
        let passionForCert = topPassion;

        // Simple translation for now as AI is disabled
        if (language === 'ar') {
            passionForCert = topPassion; 
        }
        setPassionInEnglish(passionForCert);

        await new Promise(resolve => setTimeout(resolve, 0));

        const canvas = await html2canvas(certificateRef.current, {
            scale: 2, 
            useCORS: true,
            backgroundColor: null,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('Preferences_Path_Certificate.pdf');

    } catch (e) {
        console.error(e);
        alert(dc.certificateDialog.error);
    } finally {
        setIsDownloadingCert(false);
        setShowCertDialog(false);
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

  const topPassion = rankedPassions?.rankedPassions[0]?.passion || "";

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <Certificate ref={certificateRef} name={userName} passion={passionInEnglish || topPassion} userId={certificateId} />

        {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={400} />}
        
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
            <h1 className="text-4xl font-headline font-bold text-primary">{c.fallback.title}</h1>
            <p className="text-lg text-muted-foreground">{c.fallback.subtitle}</p>
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



    
