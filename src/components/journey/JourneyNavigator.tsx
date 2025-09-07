"use client";

import { useState, useMemo, useEffect } from 'react';
import { useForm, FormProvider, useFieldArray, useFormContext } from 'react-hook-form';
import type { PassionData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { suggestSolutionsForProblems } from '@/ai/flows/suggest-solutions-for-problems';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Lightbulb, Sparkles, MoveLeft, MoveRight, PlusCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { content } from "@/lib/content";

const DynamicFieldArray = ({ pIndex, passionIndex }: { pIndex: number; passionIndex: number }) => {
  const { control } = useFormContext();
  const { language } = useLanguage();
  const stations = content[language].stations;
  const station = stations[pIndex];
  const fieldName = station.id as 'purpose' | 'power' | 'proof' | 'problems' | 'possibilities';

  const { fields, append, remove } = useFieldArray({
    control,
    name: `passions.${passionIndex}.${fieldName}`,
  });
  
  const c = content[language].journey;

  return (
    <div className="space-y-6">
      {fields.map((item, index) => (
        <div key={item.id} className="flex items-start gap-3 p-4 border rounded-lg bg-background/50 relative">
          <div className="flex-grow w-full space-y-4">
            <FormField
              control={control}
              name={`passions.${passionIndex}.${fieldName}.${index}.text`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">{c.fieldLabel} {index + 1}</FormLabel>
                  <FormControl>
                    <Input {...field} className="text-base" placeholder={c.fieldPlaceholder}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {station.id === 'purpose' && (
              <FormField
                  control={control}
                  name={`passions.${passionIndex}.${fieldName}.${index}.weight`}
                  render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">{c.weightLabel}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                          <SelectTrigger>
                          <SelectValue placeholder={c.weightPlaceholder} />
                          </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                          <SelectItem value="high">{c.weights.high}</SelectItem>
                          <SelectItem value="medium">{c.weights.medium}</SelectItem>
                          <SelectItem value="low">{c.weights.low}</SelectItem>
                      </SelectContent>
                      </Select>
                      <FormMessage />
                  </FormItem>
                  )}
              />
            )}
          </div>
          {fields.length > 1 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-1 text-destructive hover:bg-destructive/10 flex-shrink-0"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{c.removeButton}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => append({ text: '', weight: '' })}
      >
        <PlusCircle className={language === 'ar' ? 'ml-2 h-4 w-4' : 'mr-2 h-4 w-4'} />
        {c.addMoreButton}
      </Button>

       {station.id === 'problems' && <SuggestSolutionsButton passionIndex={passionIndex} />}
    </div>
  );
};

const SuggestSolutionsButton = ({ passionIndex }: { passionIndex: number }) => {
    const { getValues, setValue } = useFormContext();
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const { language } = useLanguage();
    const c = content[language].journey;
    const toastContent = content[language].toasts;


    const handleSuggestSolutions = async () => {
        const problemsData = getValues(`passions.${passionIndex}.problems`);
        const problemsText = problemsData.map((p: {text: string}) => p.text).filter(Boolean);
        
        if (problemsText.length === 0) {
            toast({
              title: toastContent.noProblems.title,
              description: toastContent.noProblems.description,
              variant: "destructive",
            });
            return;
        }
        setLoading(true);
        try {
          const result = await suggestSolutionsForProblems({ problems: problemsText });
          setValue(`passions.${passionIndex}.suggestedSolutions`, result.solutions);
          toast({
            title: toastContent.suggestionsSuccess.title,
            description: toastContent.suggestionsSuccess.description,
          });
        } catch (error) {
            toast({
              title: toastContent.error.title,
              description: toastContent.error.description,
              variant: "destructive",
            });
        } finally {
          setLoading(false);
        }
      };

    return (
        <Button onClick={handleSuggestSolutions} disabled={loading} type="button" className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Sparkles className="mr-2 h-4 w-4"/>
            {c.suggestSolutionsButton}
        </Button>
    )
}

const PossibilitiesForm = ({ pIndex, passionIndex }: { pIndex: number; passionIndex: number }) => {
    const { watch } = useFormContext();
    const suggestedSolutions = watch(`passions.${passionIndex}.suggestedSolutions`);
    const { language } = useLanguage();
    const c = content[language].journey;
  
    return (
      <div className="space-y-4">
        {suggestedSolutions && suggestedSolutions.length > 0 && (
          <Alert className="bg-accent/10 border-accent/30">
            <Sparkles className="h-4 w-4 text-accent" />
            <AlertTitle className="text-accent font-bold">{c.aiSolutions.title}</AlertTitle>
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

  const { language } = useLanguage();
  const c = content[language].journey;
  const P_STATIONS = content[language].stations;
  const ArrowLeft = language === 'ar' ? MoveLeft : MoveRight;
  const ArrowRight = language === 'ar' ? MoveRight : MoveLeft;

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

  useEffect(() => {
    const subscription = watch((value) => {
      if (value.passions) {
        onDataChange(value.passions as PassionData[]);
      }
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
  const station = P_STATIONS[currentPIndex];


  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
       <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground">
                <span>{c.progress.passion}: {currentPassionIndex + 1} / {totalPassions} ({currentPassionName})</span>
                <span>{c.progress.overall}: {Math.round(progress)}%</span>
            </div>
       </div>

        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <Card className="mt-4 overflow-hidden">
                  <CardHeader className="bg-muted/30">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 text-primary p-3 rounded-full">
                        <CurrentStationIcon className="w-8 h-8" />
                      </div>
                      <div className='flex-grow'>
                      <CardTitle className="font-headline text-2xl flex items-center gap-2">
                          {c.progress.station} {currentPIndex + 1}: {station.name}
                          <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button type="button" className="cursor-help text-accent">
                                        <Lightbulb className="h-6 w-6" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{station.hint}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                      </CardTitle>
                      <CardDescription>
                          {c.progress.exploring}: "{currentPassionName}"
                      </CardDescription>
                      </div>
                    </div>
                     <div className="flex items-center gap-2 mt-4">
                        {P_STATIONS.map((step, index) => (
                          <div
                            key={step.id}
                            className={cn(
                              "h-2 flex-1 rounded-full transition-all",
                              index === currentPIndex ? "bg-accent" : "bg-muted"
                            )}
                          />
                        ))}
                      </div>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6">
                    {station.id === 'possibilities' ? (
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
            <ArrowRight className="h-4 w-4" />
            <span className="mx-2">{c.nav.back}</span>
        </Button>
        <Button onClick={handleNext}>
            <span className="mx-2">{isLastStep ? c.nav.results : c.nav.next}</span>
            <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

    