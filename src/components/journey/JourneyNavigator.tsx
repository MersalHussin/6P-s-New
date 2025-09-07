"use client";

import { useState, useMemo, useEffect } from 'react';
import { useForm, FormProvider, useFieldArray, useFormContext } from 'react-hook-form';
import type { PassionData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { suggestSolutionsForProblems } from '@/ai/flows/suggest-solutions-for-problems';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Lightbulb, Zap, FileCheck, AlertTriangle, Goal, Sparkles, MoveLeft, MoveRight, PlusCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const P_STATIONS = [
  { id: 'purpose', name: 'الهدف', icon: Goal, hint: 'ما الذي تأمل في تحقيقه أو الشعور به من خلال هذا الشغف؟' },
  { id: 'power', name: 'القوة', icon: Zap, hint: 'ما هي المهارات والمواهب التي تمتلكها وتتعلق بهذا الشغف؟' },
  { id: 'proof', name: 'الإثبات', icon: FileCheck, hint: 'ما هي المشاريع أو التجارب السابقة التي تظهر شغفك في هذا المجال؟' },
  { id: 'problems', name: 'المشاكل', icon: AlertTriangle, hint: 'ما هي العقبات أو التحديات التي تواجهك في ممارسة هذا الشغف؟' },
  { id: 'possibilities', name: 'الاحتمالات', icon: Lightbulb, hint: 'ما هي الفرص المستقبلية أو المشاريع التي يمكنك القيام بها في هذا المجال؟' },
];

const DynamicFieldArray = ({ pIndex, passionIndex }: { pIndex: number; passionIndex: number }) => {
  const { control } = useFormContext();
  const station = P_STATIONS[pIndex];
  const fieldName = station.id as 'purpose' | 'power' | 'proof' | 'problems' | 'possibilities';

  const { fields, append, remove } = useFieldArray({
    control,
    name: `passions.${passionIndex}.${fieldName}`,
  });

  return (
    <div className="space-y-4">
      <div className='flex items-center gap-2'>
        <FormLabel className="text-lg font-headline">أخبرنا عن {station.name}</FormLabel>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-accent cursor-pointer">
                        <Lightbulb className="h-5 w-5" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{station.hint}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      </div>

      {fields.map((item, index) => (
        <div key={item.id} className="flex items-center gap-2">
           <FormField
            control={control}
            name={`passions.${passionIndex}.${fieldName}.${index}.text`}
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Textarea {...field} rows={2} className="text-base" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {fieldName === 'purpose' && (
             <FormField
                control={control}
                name={`passions.${passionIndex}.purpose.${index}.weight`}
                render={({ field }) => (
                <FormItem className="w-48">
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="الأهمية" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="high">عالية</SelectItem>
                        <SelectItem value="medium">متوسطة</SelectItem>
                        <SelectItem value="low">ضعيفة</SelectItem>
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
          )}
          {fields.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => append({ text: '', weight: '' })}
      >
        <PlusCircle className="ml-2 h-4 w-4" />
        إضافة المزيد
      </Button>

       {station.id === 'problems' && <SuggestSolutionsButton passionIndex={passionIndex} />}
    </div>
  );
};

const SuggestSolutionsButton = ({ passionIndex }: { passionIndex: number }) => {
    const { getValues, setValue } = useFormContext();
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleSuggestSolutions = async () => {
        const problems = getValues(`passions.${passionIndex}.problems`);
        const problemsText = problems.map((p: {text: string}) => p.text).join('\n');
        
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
            description: "يمكنك رؤية الحلول المقترحة في المحطة التالية.",
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
        <Button onClick={handleSuggestSolutions} disabled={loading} type="button" className="mt-4">
            {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            اقترح لي حلولاً
        </Button>
    )
}

const PossibilitiesForm = ({ pIndex, passionIndex }: { pIndex: number; passionIndex: number }) => {
    const { watch } = useFormContext();
    const suggestedSolutions = watch(`passions.${passionIndex}.suggestedSolutions`);
  
    return (
      <div className="space-y-4">
        {suggestedSolutions && suggestedSolutions.length > 0 && (
          <Alert className="bg-accent/10 border-accent/30">
            <Sparkles className="h-4 w-4 text-accent" />
            <AlertTitle className="text-accent">حلول مقترحة من الذكاء الاصطناعي</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pr-5 mt-2 space-y-1">
                {suggestedSolutions.map((solution: string, index: number) => (
                  <li key={index}>{solution}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        <DynamicFieldArray pIndex={pIndex} passionIndex={passionIndex} />
      </div>
    );
};


export function JourneyNavigator({ initialPassions, onComplete, onDataChange }: { initialPassions: PassionData[], onComplete: (data: PassionData[]) => void, onDataChange: (data: PassionData[]) => void }) {
  const methods = useForm<{ passions: PassionData[] }>({
    defaultValues: { passions: initialPassions }
  });
  const { handleSubmit, watch } = methods;

  const [currentPassionIndex, setCurrentPassionIndex] = useState(0);
  const [currentPIndex, setCurrentPIndex] = useState(0);

  const totalPStations = P_STATIONS.length;
  const totalPassions = initialPassions.length;
  
  const progress = useMemo(() => {
    const passionStep = 100 / totalPassions;
    const pStep = passionStep / totalPStations;
    const completedPassionsProgress = currentPassionIndex * passionStep;
    const currentPassionProgress = currentPIndex * pStep;
    return completedPassionsProgress + currentPassionProgress;
  }, [currentPassionIndex, currentPIndex, totalPassions, totalPStations]);

  // Save data on change
  useEffect(() => {
    const subscription = watch((value) => {
      onDataChange(value.passions as PassionData[]);
    });
    return () => subscription.unsubscribe();
  }, [watch, onDataChange]);

  const handleNext = () => {
    if (currentPIndex < totalPStations - 1) {
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
      setCurrentPIndex(totalPStations - 1);
    }
  };

  const isLastStep = currentPassionIndex === totalPassions - 1 && currentPIndex === totalPStations - 1;

  const onSubmit = (data: { passions: PassionData[] }) => {
    onComplete(data.passions);
  };
  
  const CurrentStationIcon = P_STATIONS[currentPIndex].icon;
  const currentPassionName = initialPassions[currentPassionIndex].name;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
       <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground">
                <span>الشغف: {currentPassionIndex + 1} / {totalPassions} ({currentPassionName})</span>
                <span>التقدم الكلي: {Math.round(progress)}%</span>
            </div>
       </div>

        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card className="mt-4">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 text-primary p-3 rounded-full">
                        <CurrentStationIcon className="w-8 h-8" />
                      </div>
                      <div>
                      <CardTitle className="font-headline text-2xl">
                          المحطة {currentPIndex + 1}: {P_STATIONS[currentPIndex].name}
                      </CardTitle>
                      <CardDescription>
                          استكشاف شغف: "{currentPassionName}"
                      </CardDescription>
                      <div className="flex items-center gap-2 mt-2">
                        {P_STATIONS.map((step, index) => (
                          <div
                            key={step.id}
                            className={cn(
                              "h-2 flex-1 rounded-full",
                              index === currentPIndex ? "bg-accent" : "bg-muted"
                            )}
                          />
                        ))}
                      </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {P_STATIONS[currentPIndex].id === 'possibilities' ? (
                       <PossibilitiesForm pIndex={currentPIndex} passionIndex={currentPassionIndex} />
                    ) : (
                       <DynamicFieldArray pIndex={currentPIndex} passionIndex={currentPassionIndex} />
                    )}
                  </CardContent>
                </Card>
            </form>
        </FormProvider>
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
