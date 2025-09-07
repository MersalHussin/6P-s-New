"use client";

import { useState, useMemo } from 'react';
import { useForm, FormProvider, useFormContext, Controller } from 'react-hook-form';
import type { PassionData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { suggestSolutionsForProblems } from '@/ai/flows/suggest-solutions-for-problems';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Lightbulb, Zap, FileCheck, AlertTriangle, Goal, Sparkles, MoveLeft, MoveRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

const P_STEPS = [
  { id: 'purpose', name: 'الهدف', icon: Goal },
  { id: 'power', name: 'القوة', icon: Zap },
  { id: 'proof', name: 'الإثبات', icon: FileCheck },
  { id: 'problems', name: 'المشاكل', icon: AlertTriangle },
  { id: 'possibilities', name: 'الاحتمالات', icon: Lightbulb },
];

const GeneralForm = ({ pIndex, passionIndex }: { pIndex: number; passionIndex: number }) => {
  const { control } = useFormContext();
  const step = P_STEPS[pIndex];
  const fieldName = step.id as 'power' | 'proof' | 'problems' | 'possibilities';

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name={`passions.${passionIndex}.${fieldName}`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg font-headline">أخبرنا عن {step.name}</FormLabel>
            <FormControl>
              <Textarea {...field} rows={6} className="text-base" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

const PurposeForm = ({ passionIndex }: { passionIndex: number }) => {
  const { control } = useFormContext();
  return (
    <div className="space-y-6">
      {[0, 1, 2].map((index) => (
        <div key={index} className="space-y-2 rounded-lg border p-4">
          <FormField
            control={control}
            name={`passions.${passionIndex}.purpose.${index}.text`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>الهدف {index + 1}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={`اكتب هدفك من هذا الشغف...`}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`passions.${passionIndex}.purpose.${index}.weight`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>درجة الأهمية</FormLabel>
                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر درجة الأهمية" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="high">عالية (6 نقاط)</SelectItem>
                    <SelectItem value="medium">متوسطة (4 نقاط)</SelectItem>
                    <SelectItem value="low">ضعيفة (نقطتان)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
    </div>
  );
};

const ProblemsForm = ({ pIndex, passionIndex }: { pIndex: number; passionIndex: number }) => {
  const { control, getValues, setValue } = useFormContext();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSuggestSolutions = async () => {
    const problemsText = getValues(`passions.${passionIndex}.problems`);
    if (!problemsText || problemsText.trim() === "") {
        toast({
          title: "لا توجد مشاكل",
          description: "الرجاء كتابة المشاكل التي تواجهك أولاً.",
          variant: "destructive",
        });
        return;
    }
    setLoading(true);
    try {
      const result = await suggestSolutionsForProblems({ problems: [problemsText] });
      setValue(`passions.${passionIndex}.suggestedSolutions`, result.solutions);
      toast({
        title: "تم إنشاء الاقتراحات بنجاح!",
        description: "يمكنك رؤية الحلول المقترحة في الخطوة التالية.",
      });
    } catch (error) {
        toast({
          title: "حدث خطأ",
          description: "لم نتمكن من إنشاء اقتراحات. الرجاء المحاولة مرة أخرى.",
          variant: "destructive",
        });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <GeneralForm pIndex={pIndex} passionIndex={passionIndex} />
      <Button onClick={handleSuggestSolutions} disabled={loading} type="button">
        {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        اقترح لي حلولاً
      </Button>
    </div>
  );
};

const PossibilitiesForm = ({ pIndex, passionIndex }: { pIndex: number; passionIndex: number }) => {
    const { watch } = useFormContext();
    const suggestedSolutions = watch(`passions.${passionIndex}.suggestedSolutions`);
  
    return (
      <div className="space-y-4">
        {suggestedSolutions && suggestedSolutions.length > 0 && (
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertTitle>حلول مقترحة من الذكاء الاصطناعي</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pr-5 mt-2 space-y-1">
                {suggestedSolutions.map((solution: string, index: number) => (
                  <li key={index}>{solution}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        <GeneralForm pIndex={pIndex} passionIndex={passionIndex} />
      </div>
    );
};


export function JourneyNavigator({ initialPassions, onComplete }: { initialPassions: PassionData[], onComplete: (data: PassionData[]) => void }) {
  const methods = useForm<{ passions: PassionData[] }>({
    defaultValues: { passions: initialPassions }
  });
  const { handleSubmit } = methods;

  const [currentPassionIndex, setCurrentPassionIndex] = useState(0);
  const [currentPIndex, setCurrentPIndex] = useState(0);

  const totalPSteps = P_STEPS.length;
  const totalPassions = initialPassions.length;
  
  const progress = useMemo(() => {
    const passionStep = 1 / totalPassions;
    const pStep = passionStep / totalPSteps;
    return (currentPassionIndex * passionStep + currentPIndex * pStep) * 100;
  }, [currentPassionIndex, currentPIndex, totalPassions, totalPSteps]);

  const handleNext = () => {
    if (currentPIndex < totalPSteps - 1) {
      setCurrentPIndex(currentPIndex + 1);
    } else if (currentPassionIndex < totalPassions - 1) {
      setCurrentPassionIndex(currentPassionIndex + 1);
      setCurrentPIndex(0);
    } else {
        handleSubmit(onSubmit)();
    }
  };

  const handleBack = () => {
    if (currentPIndex > 0) {
      setCurrentPIndex(currentPIndex - 1);
    } else if (currentPassionIndex > 0) {
      setCurrentPassionIndex(currentPassionIndex - 1);
      setCurrentPIndex(totalPSteps - 1);
    }
  };

  const isLastStep = currentPassionIndex === totalPassions - 1 && currentPIndex === totalPSteps - 1;

  const onSubmit = (data: { passions: PassionData[] }) => {
    onComplete(data.passions);
  };
  
  const CurrentStepIcon = P_STEPS[currentPIndex].icon;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
       <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground text-center">
                التقدم الكلي: {Math.round(progress)}%
            </p>
       </div>

      <Tabs value={String(currentPassionIndex)} onValueChange={(val) => setCurrentPassionIndex(Number(val))} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {initialPassions.map((passion, index) => (
            <TabsTrigger key={passion.id} value={String(index)}>{passion.name}</TabsTrigger>
          ))}
        </TabsList>
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card className="mt-4">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 text-primary p-3 rounded-full">
                        <CurrentStepIcon className="w-8 h-8" />
                      </div>
                      <div>
                      <CardTitle className="font-headline text-2xl">
                          {P_STEPS[currentPIndex].name}: {initialPassions[currentPassionIndex].name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        {P_STEPS.map((step, index) => (
                          <div
                            key={step.id}
                            className={cn(
                              "h-2 flex-1 rounded-full",
                              index === currentPIndex ? "bg-primary" : "bg-muted"
                            )}
                          />
                        ))}
                      </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {P_STEPS[currentPIndex].id === 'purpose' && <PurposeForm passionIndex={currentPassionIndex} />}
                    {P_STEPS[currentPIndex].id === 'power' && <GeneralForm pIndex={currentPIndex} passionIndex={currentPassionIndex} />}
                    {P_STEPS[currentPIndex].id === 'proof' && <GeneralForm pIndex={currentPIndex} passionIndex={currentPassionIndex} />}
                    {P_STEPS[currentPIndex].id === 'problems' && <ProblemsForm pIndex={currentPIndex} passionIndex={currentPassionIndex} />}
                    {P_STEPS[currentPIndex].id === 'possibilities' && <PossibilitiesForm pIndex={currentPIndex} passionIndex={currentPassionIndex} />}
                  </CardContent>
                </Card>
            </form>
        </FormProvider>
      </Tabs>
      <div className="flex justify-between items-center mt-6">
        <Button onClick={handleBack} variant="outline" disabled={currentPassionIndex === 0 && currentPIndex === 0}>
            <MoveRight className="ml-2 h-4 w-4" />
            السابق
        </Button>
        <Button onClick={handleNext}>
            {isLastStep ? 'اعرض النتائج' : 'التالي'}
            <MoveLeft className="mr-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
