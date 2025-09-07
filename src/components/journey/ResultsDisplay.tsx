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

interface ResultsDisplayProps {
  passions: PassionData[];
}

export function ResultsDisplay({ passions }: ResultsDisplayProps) {
  const [rankedPassions, setRankedPassions] = useState<RankPassionsOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

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
            power: p.power,
            proof: p.proof,
            problems: p.problems,
            possibilities: p.possibilities,
          }))
        };
        
        const result = await rankPassions(input);
        
        result.rankedPassions.sort((a, b) => b.score - a.score);
        
        setRankedPassions(result);

      } catch (e) {
        console.error(e);
        setError("حدث خطأ أثناء ترتيب شغفك. الرجاء المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    getRanking();
  }, [passions]);

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    try {
      const input: GenerateDetailedReportInput = { passions };
      const { report } = await generateDetailedReport(input);

      const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Passion_Path_Report.txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (e) {
      console.error(e);
      alert("حدث خطأ أثناء إنشاء التقرير. الرجاء المحاولة مرة أخرى.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <h2 className="text-2xl font-headline text-muted-foreground">جاري تحليل وترتيب شغفك...</h2>
        <p className="text-center">يستخدم الذكاء الاصطناعي لتحليل إجاباتك وتقديم أفضل ترتيب لك.</p>
      </div>
    );
  }

  if (error) {
    return (
        <Card className="w-full max-w-2xl mx-auto bg-destructive/10 border-destructive">
            <CardHeader>
                <CardTitle>حدث خطأ</CardTitle>
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
            <h1 className="text-4xl font-headline font-bold text-primary">نتائج رحلتك</h1>
            <p className="text-lg text-muted-foreground">هذا هو ترتيب شغفك بناءً على إجاباتك. استكشف النتائج لتعرف أين يكمن شغفك الأقوى.</p>
            <Button onClick={handleDownloadReport} disabled={isDownloading}>
              {isDownloading ? (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="ml-2 h-4 w-4" />
              )}
              {isDownloading ? 'جاري إنشاء التقرير...' : 'تنزيل التقرير المفصل'}
            </Button>
        </div>
      <div className="space-y-6">
        {rankedPassions?.rankedPassions.map((passion, index) => (
          <Card key={passion.passion} className="shadow-md transition-all hover:shadow-xl hover:border-primary/50">
            <CardHeader className="flex flex-row items-start gap-4">
                <div className="flex-shrink-0">
                    <Badge className="text-3xl font-bold h-16 w-16 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                        {index + 1}
                    </Badge>
                </div>
                <div className="flex-grow">
                    <CardTitle className="text-2xl font-headline">{passion.passion}</CardTitle>
                    <CardDescription>الدرجة: {passion.score}</CardDescription>
                </div>
                <div className="flex-shrink-0">
                    <Award className="w-8 h-8 text-yellow-500"/>
                </div>
            </CardHeader>
            <CardContent>
              <h4 className="font-bold mb-2">سبب التقييم:</h4>
              <p className="text-muted-foreground">{passion.reasoning}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
