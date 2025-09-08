
"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import { useForm, FormProvider, useFieldArray, useFormContext } from 'react-hook-form';
import type { PassionData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { suggestSolutionsForProblems } from '@/ai/flows/suggest-solutions-for-problems';
import { explainHint } from '@/ai/flows/explain-hint';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Lightbulb, Sparkles, MoveLeft, MoveRight, PlusCircle, Trash2, Wand2, ArrowRight, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogClose,
  } from "@/components/ui/dialog"
import { content } from "@/lib/content";

const AIHelperButton = ({ hint, passionName, stationName }: { hint: string, passionName: string, stationName: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [explanation, setExplanation] = useState("");
    const { language } = useLanguage();
    const c = content[language].journey;
    const toastContent = content[language].toasts;
  
    const handleAIClick = async () => {
      setIsOpen(true);
      if (explanation) return;
  
      setIsLoading(true);
      try {
        const result = await explainHint({
          passionName,
          hint,
          stationName,
          language,
        });
        setExplanation(result.explanation);
      } catch (error) {
        toast({
          title: toastContent.error.title,
          description: toastContent.error.description,
          variant: "destructive",
        });
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <>
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-accent hover:bg-accent/10" onClick={handleAIClick}>
                        <Wand2 className="h-5 w-5" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                    <p>{c.aiHelper.tooltip}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[425px]" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <DialogHeader>
              <DialogTitle className='flex items-center gap-2'><Wand2 className="h-5 w-5 text-accent"/>{c.aiHelper.title}</DialogTitle>
              <DialogDescription>
                {c.aiHelper.description}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <p>{c.aiHelper.loading}</p>
                </div>
              ) : (
                <div className="space-y-4 text-sm whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
                    <blockquote className="border-r-4 border-accent pr-4 italic bg-accent/10 p-2 rounded">
                       "{hint}"
                    </blockquote>
                    <p>{explanation}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  };

const DynamicFieldArray = ({ pIndex, passionIndex, passionName }: { pIndex: number; passionIndex: number, passionName: string }) => {
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
  const stationContent = content[language].stations[pIndex];

  return (
    <div className="space-y-6">
      {fields.map((item, index) => (
        <div key={item.id} className="flex items-start gap-3 p-4 border rounded-lg bg-background/50 relative">
          <div className="w-full space-y-4">
            <FormField
              control={control}
              name={`passions.${passionIndex}.${fieldName}.${index}.text`}
              render={({ field }) => (
                <FormItem>
                    <div className="flex items-center justify-between">
                        <FormLabel className="font-semibold text-md flex items-center gap-2">
                           {stationContent.singular} {index + 1}
                           <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button type="button" className="cursor-help text-muted-foreground hover:text-accent">
                                        <Lightbulb className="h-5 w-5" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-accent text-accent-foreground border-accent-foreground/20" side="top" align="center">
                                    <p className="max-w-xs">{stationContent.hints[index % stationContent.hints.length]}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <AIHelperButton 
                            hint={stationContent.hints[index % stationContent.hints.length]}
                            passionName={passionName}
                            stationName={stationContent.name}
                        />
                        </FormLabel>
                    </div>
                  <FormControl>
                    <Input {...field} className="text-base" placeholder={c.fieldPlaceholder}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
          </div>
          {index >= 3 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-8 text-destructive hover:bg-destructive/10 flex-shrink-0"
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
        onClick={() => append({ id: (fields.length + 1).toString(), text: '', weight: '' })}
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

const PossibilitiesForm = ({ pIndex, passionIndex, passionName }: { pIndex: number; passionIndex: number; passionName: string }) => {
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
        <DynamicFieldArray pIndex={pIndex} passionIndex={passionIndex} passionName={passionName} />
      </div>
    );
};


export function JourneyNavigator({ initialPassions, onComplete, onDataChange }: { initialPassions: PassionData[], onComplete: (data: PassionData[]) => void, onDataChange: (data: PassionData[]) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
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
  const [showNextPassionDialog, setShowNextPassionDialog] = useState(false);

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

  const scrollToTop = () => {
    containerRef.current?.scrollTo(0, 0);
    window.scrollTo(0, 0);
  };

  const handleNext = () => {
    scrollToTop();
    if (currentPIndex < totalPStations - 1) {
      setCurrentPIndex(currentPIndex + 1);
    } else if (currentPassionIndex < totalPassions - 1) {
      setShowNextPassionDialog(true);
    } else {
        handleSubmit(onSubmit)();
    }
  };

  const proceedToNextPassion = () => {
    setShowNextPassionDialog(false);
    setCurrentPassionIndex(currentPassionIndex + 1);
    setCurrentPIndex(0);
  }

  const handleBack = () => {
    scrollToTop();
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
    <div className="w-full max-w-4xl mx-auto" ref={containerRef}>
         <Dialog open={showNextPassionDialog} onOpenChange={setShowNextPassionDialog}>
            <DialogContent dir={language === 'ar' ? 'rtl' : 'ltr'} className="text-center p-8">
                <DialogHeader>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <DialogTitle className="text-2xl font-bold">{c.nextPassionDialog.title(initialPassions[currentPassionIndex].name)}</DialogTitle>
                    <DialogDescription className="text-muted-foreground text-base leading-relaxed mt-2">
                        {c.nextPassionDialog.description}
                    </DialogDescription>
                </DialogHeader>
                <div className="my-6">
                    <p className="text-sm text-muted-foreground mb-2">{c.nextPassionDialog.nextPassion}</p>
                    <p className="text-3xl font-headline font-bold text-primary">
                        {initialPassions[currentPassionIndex + 1]?.name || ""}
                    </p>
                </div>
                <DialogClose asChild>
                    <Button onClick={proceedToNextPassion} className="mt-4 w-full" size="lg">
                        {c.nextPassionDialog.cta}
                        <ArrowRight className="h-5 w-5" />
                    </Button>
                </DialogClose>
            </DialogContent>
        </Dialog>

        <div className="sticky top-4 z-10 bg-background/80 backdrop-blur-sm rounded-lg p-4 mb-6 border shadow-sm">
            <div className="flex justify-between items-center">
                <div className="space-y-2 flex-grow">
                    <Progress value={progress} className="w-full" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{c.progress.station}: {P_STATIONS[currentPIndex].name}</span>
                        <span>{c.progress.overall}: {Math.round(progress)}%</span>
                    </div>
                </div>
                <div className={cn("flex-shrink-0", language === 'ar' ? "mr-4" : "ml-4")}>
                    <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">
                        {c.progress.exploring}: {currentPassionName}
                    </Button>
                </div>
            </div>
        </div>

        <div className="space-y-6">
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
                            {language === 'ar' && <span className='text-lg font-body text-muted-foreground'>({station.id})</span>}
                        </CardTitle>
                        <CardDescription>
                            {station.description}
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
                        <PossibilitiesForm pIndex={currentPIndex} passionIndex={currentPassionIndex} passionName={currentPassionName} />
                        ) : (
                        <DynamicFieldArray pIndex={currentPIndex} passionIndex={currentPassionIndex} passionName={currentPassionName} />
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
    </div>
  );
}
