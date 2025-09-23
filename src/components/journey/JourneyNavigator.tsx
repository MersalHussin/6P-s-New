
"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useForm, FormProvider, useFieldArray, useFormContext } from 'react-hook-form';
import type { PassionData, FieldItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { suggestSolutionsForProblems } from '@/ai/flows/suggest-solutions-for-problems';
import { explainHint } from '@/ai/flows/explain-hint';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Lightbulb, Sparkles, MoveLeft, MoveRight, PlusCircle, Trash2, Wand2, ArrowRight, CheckCircle, Star } from 'lucide-react';
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
import * as z from "zod";
import { ConfirmationDialog } from './ConfirmationDialog';


const AIHelperButton = ({ hints, passionName, stationName }: { hints: string[], passionName: string, stationName: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [explanation, setExplanation] = useState("");
    const { language } = useLanguage();
    const c = content[language].journey;
    const toastContent = content[language].toasts;
    const { toast } = useToast();
  
    const handleAIClick = async () => {
      setIsOpen(true);
      if (explanation) return;
  
      setIsLoading(true);
      try {
        const result = await explainHint({
          passionName,
          hints,
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
                    <p>{explanation}</p>
                </div>
              )}
            </div>
             <DialogClose asChild>
                <Button variant="outline">{c.aiHelper.closeButton}</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
        
        <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleAIClick}
            >
            <Wand2 className="h-5 w-5 text-accent" />
            <span>{c.aiHelper.buttonTitle}</span>
        </Button>
      </>
    );
  };

const StarRating = ({ field, stationId }: { field: any, stationId: string }) => {
    const [hover, setHover] = useState(0);
    const { language } = useLanguage();
    const ratingContent = content[language].journey.ratings[stationId] || content[language].journey.ratings.default;

    const isProblemStation = stationId === 'problems';
    const isPossibilitiesStation = stationId === 'possibilities';
    
    const activeColor = isProblemStation 
      ? "text-red-500" 
      : isPossibilitiesStation 
      ? "text-green-500"
      : "text-yellow-400";
  
    return (
      <div className="space-y-2">
        <div dir="ltr" className="flex items-center justify-center gap-2">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
                <TooltipProvider key={ratingValue} delayDuration={0}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                type="button"
                                key={ratingValue}
                                className={cn(
                                    "h-8 w-8 transition-colors",
                                    ratingValue <= (hover || field.value) ? activeColor : "text-gray-300"
                                )}
                                onClick={() => field.onChange(ratingValue)}
                                onMouseEnter={() => setHover(ratingValue)}
                                onMouseLeave={() => setHover(0)}
                            >
                                <Star className="h-full w-full" fill="currentColor" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{ratingValue}: {ratingContent[ratingValue-1]}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
          })}
        </div>
        <div className="text-center text-sm font-semibold text-primary h-5">
            {hover > 0 ? ratingContent[hover-1] : field.value > 0 ? ratingContent[field.value-1] : " " }
        </div>
      </div>
    );
};
  

const DynamicFieldArray = ({ pIndex, passionIndex, passionName }: { pIndex: number; passionIndex: number, passionName: string }) => {
  const { control } = useFormContext();
  const { language } = useLanguage();
  const stations = content[language].stations;
  const station = stations[pIndex + 1];
  const fieldName = station.id as 'purpose' | 'power' | 'proof' | 'problems' | 'possibilities';

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: `passions.${passionIndex}.${fieldName}`,
  });

  const [hintOpen, setHintOpen] = useState(false);
  const [currentHint, setCurrentHint] = useState("");

  useEffect(() => {
    if (fields.length === 0) {
      replace([
        { id: '1', text: '', weight: 0 },
        { id: '2', text: '', weight: 0 },
        { id: '3', text: '', weight: 0 },
      ]);
    }
  }, [fields, replace]);
  
  const c = content[language].journey;
  const stationContent = content[language].stations[pIndex + 1];

  return (
    <>
      <Dialog open={hintOpen} onOpenChange={setHintOpen}>
        <DialogContent dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle>Hint</DialogTitle>
          </DialogHeader>
          <p className="py-4">{currentHint}</p>
        </DialogContent>
      </Dialog>
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
                          </FormLabel>
                           <div className="flex items-center gap-1">
                                <AIHelperButton
                                    hints={stationContent.hints}
                                    passionName={passionName}
                                    stationName={stationContent.name}
                                />
                                <button
                                    type="button"
                                    className="cursor-help text-muted-foreground hover:text-accent h-7 w-7 flex items-center justify-center"
                                    onClick={() => {
                                    setCurrentHint(stationContent.hints[index % stationContent.hints.length]);
                                    setHintOpen(true);
                                    }}
                                >
                                    <Lightbulb className="h-5 w-5" />
                                </button>
                            </div>
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
                    <FormLabel className="font-semibold text-center block mb-2">{c.weightLabels[station.id] || c.weightLabels.default}</FormLabel>
                    <FormControl>
                      <StarRating field={field} stationId={station.id} />
                    </FormControl>
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
        {fields.length < 6 && (
          <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => append({ id: `${fields.length + 1}`, text: '', weight: 0 })}
          >
              <PlusCircle className={language === 'ar' ? 'ml-2 h-4 w-4' : 'mr-2 h-4 w-4'} />
              {c.addMoreButton}
          </Button>
        )}
      </div>
    </>
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
          
          const possibilities = getValues(`passions.${passionIndex}.possibilities`) as FieldItem[];
          const newPossibilities = possibilities.map((possibility, index) => {
              return {
                  ...possibility,
                  text: result.solutions[index] || possibility.text || ''
              }
          });
          setValue(`passions.${passionIndex}.possibilities`, newPossibilities, { shouldValidate: true });

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
        <Button onClick={handleSuggestSolutions} disabled={loading} type="button" className="w-full mt-4 bg-accent text-accent-foreground hover:bg-accent/90">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Sparkles className="mr-2 h-4 w-4"/>
            {c.suggestSolutionsButton}
        </Button>
    )
}


const PossibilitiesForm = ({ passionIndex, passionName }: { passionIndex: number; passionName: string }) => {
    const { control, watch } = useFormContext();
    const { language } = useLanguage();
    const c = content[language].journey;
    
    const { fields: possibilityFields, replace: replacePossibilities } = useFieldArray({
        control,
        name: `passions.${passionIndex}.possibilities`,
    });
    
    const problems = watch(`passions.${passionIndex}.problems`) as FieldItem[];
    const validProblems = useMemo(() => problems.filter(p => p.text.trim() !== ''), [problems]);

    useEffect(() => {
        const currentPossibilities = watch(`passions.${passionIndex}.possibilities`) || [];
        const newPossibilities = validProblems.map((problem, index) => {
            return {
                 id: problem.id, 
                 text: currentPossibilities?.[index]?.text || '', 
                 weight: currentPossibilities?.[index]?.weight || 0 
            };
        });
        
        if (JSON.stringify(newPossibilities) !== JSON.stringify(currentPossibilities.slice(0, newPossibilities.length))) {
            replacePossibilities(newPossibilities);
        }
    }, [validProblems, replacePossibilities, watch, passionIndex]);
    
    return (
        <div className="space-y-6">
            <SuggestSolutionsButton passionIndex={passionIndex} />
            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">{c.orLabel}</span>
                </div>
            </div>

            {possibilityFields.map((item, index) => {
                const problem = validProblems[index];
                if (!problem) return null;

                return (
                    <div key={item.id} className="p-4 border rounded-lg bg-background/50 space-y-4">
                        {/* Display the problem */}
                        <div className="space-y-2">
                             <Label className="font-semibold text-md text-muted-foreground">
                                {c.problemLabel} {index + 1}
                             </Label>
                             <p className="p-3 bg-muted rounded-md text-foreground font-medium">{problem.text}</p>
                        </div>
                        
                        {/* Input for the solution/possibility */}
                        <FormField
                            control={control}
                            name={`passions.${passionIndex}.possibilities.${index}.text`}
                            render={({ field }) => (
                                <FormItem>
                                     <div className="flex items-center justify-between">
                                        <FormLabel className="font-semibold text-md flex items-center gap-2">
                                            {c.possibilityLabel}
                                        </FormLabel>
                                    </div>
                                    <FormControl>
                                        <Input {...field} className="text-base" placeholder={c.fieldPlaceholder} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        {/* Rating for the possibility */}
                        <FormField
                            control={control}
                            name={`passions.${passionIndex}.possibilities.${index}.weight`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold text-center block mb-2">
                                        {c.weightLabels.possibilities}
                                    </FormLabel>
                                    <FormControl>
                                        <StarRating field={field} stationId="possibilities" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                );
            })}
        </div>
    );
};


export function JourneyNavigator({ initialPassions, onComplete, onDataChange }: { initialPassions: PassionData[], onComplete: (data: PassionData[]) => void, onDataChange: (data: PassionData[]) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const methods = useForm<{ passions: PassionData[] }>({
    defaultValues: { passions: initialPassions }
  });
  const { handleSubmit, watch, getValues } = methods;
  const { toast } = useToast();

  const { language } = useLanguage();
  const c = content[language].journey;
  const t = content[language].toasts;
  const P_STATIONS = content[language].stations.filter(s => s.id !== 'passion-selection');
  const ArrowLeft = language === 'ar' ? MoveLeft : MoveRight;
  const ArrowRight = language === 'ar' ? MoveRight : MoveLeft;

  const [currentPassionIndex, setCurrentPassionIndex] = useState(0);
  const [currentPIndex, setCurrentPIndex] = useState(0);
  const [showNextPassionDialog, setShowNextPassionDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmDialogData, setConfirmDialogData] = useState<FieldItem[]>([]);

  const totalPStations = P_STATIONS.length;
  const totalPassions = initialPassions.length;
  
  const passionProgress = useMemo(() => {
    return (currentPIndex / totalPStations) * 100;
  }, [currentPIndex, totalPStations]);

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

  const currentPassionName = initialPassions[currentPassionIndex].name;
  const currentFieldName = P_STATIONS[currentPIndex].id as keyof Omit<PassionData, 'id' | 'name' | 'suggestedSolutions'>;
  
  const isCurrentStepValid = () => {
    const stationData = getValues(`passions.${currentPassionIndex}.${currentFieldName}`) as PassionData['purpose'];
    
    if (!stationData) return false;

    // For the possibilities station, we check based on the number of problems
    if (currentFieldName === 'possibilities') {
        const problems = getValues(`passions.${currentPassionIndex}.problems`).filter((p: FieldItem) => p.text.trim() !== '');
        // Validate that each possibility corresponding to a problem has text and weight
         const validationSchema = z.array(z.object({
            text: z.string().min(1, { message: "Text cannot be empty." }),
            weight: z.number().min(1, { message: "Weight must be selected." }),
            id: z.string()
        })).min(problems.length);
        const result = validationSchema.safeParse(stationData.slice(0, problems.length));
         if (!result.success) {
            toast({
                title: t.validationError.title,
                description: language === 'ar' ? 'الرجاء كتابة حل وتقييم لكل مشكلة.' : 'Please write and rate a solution for each problem.',
                variant: "destructive",
            });
            return false;
         }

    } else {
         const firstThreeItems = stationData.slice(0, 3);
  
        const validationSchema = z.array(z.object({
        text: z.string().min(1, { message: "Text cannot be empty." }),
        weight: z.number().min(1, { message: "Text must be selected." }),
        id: z.string()
        })).min(3);
    
        const result = validationSchema.safeParse(firstThreeItems);
    
        if (!result.success) {
        let specificMessage = t.validationError.description;
    
        if (result.error.errors[0]) {
            const firstError = result.error.errors[0];
            const fieldIndex = parseInt(firstError.path[0] as string, 10);
            const fieldType = firstError.path[1];
            if (language === 'ar') {
            if (fieldType === 'text') {
                specificMessage = `يرجاء ملء الحقل رقم ${fieldIndex + 1}.`;
            } else if (fieldType === 'weight') {
                specificMessage = `يرجاء اختيار تقييم للحقل رقم ${fieldIndex + 1}.`;
            }
            } else {
                if (fieldType === 'text') {
                    specificMessage = `Please fill out item #${fieldIndex + 1}.`;
                } else if (fieldType === 'weight') {
                    specificMessage = `Please select a rating for item #${fieldIndex + 1}.`;
                }
            }
        }

        toast({
            title: t.validationError.title,
            description: specificMessage,
            variant: "destructive",
        });
        return false;
        }
    }
  
    return true;
  };

  const handleNext = async () => {
    if (!isCurrentStepValid()) {
      return;
    }

    const stationData = getValues(`passions.${currentPassionIndex}.${currentFieldName}`);
    setConfirmDialogData(stationData);
    setShowConfirmDialog(true);
  };
  
  const handleConfirmNext = useCallback(async () => {
    setShowConfirmDialog(false);
    if (currentPIndex < totalPStations - 1) {
      setCurrentPIndex(currentPIndex + 1);
    } else if (currentPassionIndex < totalPassions - 1) {
      setShowNextPassionDialog(true);
    } else {
        await handleSubmit(onSubmit)();
    }
    scrollToTop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPIndex, totalPStations, currentPassionIndex, totalPassions, handleSubmit]);

  const handleCancelNext = () => {
    setShowConfirmDialog(false);
  };

  const proceedToNextPassion = () => {
    setShowNextPassionDialog(false);
    setCurrentPassionIndex(currentPassionIndex + 1);
    setCurrentPIndex(0);
  }

  const handleBack = () => {
    if (currentPIndex > 0) {
      setCurrentPIndex(currentPIndex - 1);
    } else if (currentPassionIndex > 0) {
      setCurrentPassionIndex(currentPassionIndex - 1);
      setCurrentPIndex(totalPStations - 1);
    }
    scrollToTop();
  };

  const isLastStep = currentPassionIndex === totalPassions - 1 && currentPIndex === totalPStations - 1;

  const onSubmit = (data: { passions: PassionData[] }) => {
    // This is called on the final step
    onComplete(data.passions);
  };
  
  const CurrentStationIcon = P_STATIONS[currentPIndex].icon;
  const station = P_STATIONS[currentPIndex];


  return (
    <div className="w-full max-w-4xl mx-auto" ref={containerRef}>
        <ConfirmationDialog
            isOpen={showConfirmDialog}
            onClose={handleCancelNext}
            onConfirm={handleConfirmNext}
            title={c.stationConfirm.title(station.name, currentPassionName)}
            description={c.stationConfirm.description}
            confirmText={c.stationConfirm.continue}
            cancelText={c.stationConfirm.edit}
            duration={5}
            data={confirmDialogData}
        />
        
        <Dialog open={showNextPassionDialog} onOpenChange={setShowNextPassionDialog}>
            <DialogContent dir={language === 'ar' ? 'rtl' : 'ltr'} className="p-8">
                <DialogHeader className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <DialogTitle className="text-2xl font-bold">{c.nextPassionDialog.title(initialPassions[currentPassionIndex].name)}</DialogTitle>
                    <DialogDescription className="text-muted-foreground text-base leading-relaxed mt-2">
                        {c.nextPassionDialog.description}
                    </DialogDescription>
                </DialogHeader>
                <div className="my-6 text-center">
                    <p className="text-sm text-muted-foreground mb-2">{c.nextPassionDialog.nextPassion}</p>
                    <p className="text-3xl font-headline font-bold text-primary">
                        {initialPassions[currentPassionIndex + 1]?.name || ""}
                    </p>
                </div>
                <DialogClose asChild>
                    <Button onClick={proceedToNextPassion} className="mt-4 w-full" size="lg">
                        {c.nextPassionDialog.cta}
                        <ArrowRight className={language === 'ar' ? "mr-2 h-5 w-5" : "ml-2 h-5 w-5"} />
                    </Button>
                </DialogClose>
            </DialogContent>
        </Dialog>

        <div className="sticky top-20 z-10 bg-background/80 backdrop-blur-sm rounded-lg p-4 mb-6 border shadow-sm space-y-4">
            <div className="flex w-full items-center gap-2">
                {initialPassions.map((passion, index) => (
                    <div key={passion.id} className="flex-1 space-y-1 text-center">
                         <div className="bg-muted rounded-full overflow-hidden w-full h-2.5 relative" dir="ltr">
                            <div 
                                className={cn(
                                    "h-full rounded-full transition-all duration-500",
                                    index < currentPassionIndex ? 'bg-primary' : 'bg-transparent'
                                )}
                                style={{ width: '100%' }}
                            />
                             {index === currentPassionIndex && (
                                <div 
                                    className={cn("absolute top-0 h-full bg-accent rounded-full transition-all duration-500", language === 'ar' ? 'right-0' : 'left-0')}
                                    style={{ width: `${passionProgress}%` }}
                                />
                             )}
                         </div>
                         <span className={cn(
                             "text-xs font-medium",
                             index === currentPassionIndex ? 'text-accent' : 'text-muted-foreground'
                         )}>
                             {passion.name}
                         </span>
                    </div>
                ))}
            </div>
             <div className="flex justify-between items-center text-center">
                <div className="text-sm text-primary font-bold bg-primary/10 px-3 py-1 rounded-full">
                    <span>{c.progress.passion}:</span> {currentPassionName}
                </div>
                <div className="text-sm text-accent font-bold bg-accent/10 px-3 py-1 rounded-full">
                    <span>{c.progress.station}:</span> {P_STATIONS[currentPIndex].name}
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Card key={`${currentPassionIndex}-${currentPIndex}`} className="mt-4 overflow-hidden">
                    <CardHeader className="bg-muted/30">
                        <div className="flex flex-col gap-4">
                            <div className='flex items-center gap-4'>
                                <div className="bg-primary/10 text-primary p-3 rounded-full">
                                    <CurrentStationIcon className="w-8 h-8" />
                                </div>
                                <div>
                                    <CardTitle className="font-headline text-2xl">
                                        {language === 'ar' ? `محطة ${station.name}` : `Station: ${station.name}`}
                                    </CardTitle>
                                    <CardDescription className="mt-2 text-base">
                                        {station.description(currentPassionName)}
                                    </CardDescription>
                                </div>
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
                            <PossibilitiesForm passionIndex={currentPassionIndex} passionName={currentPassionName} />
                        ) : (
                            <DynamicFieldArray pIndex={currentPIndex} passionIndex={currentPassionIndex} passionName={currentPassionName} />
                        )}
                    </CardContent>
                    </Card>
                    <div className="flex justify-between items-center mt-6">
                        <Button type="button" onClick={handleBack} variant="outline" disabled={currentPassionIndex === 0 && currentPIndex === 0}>
                            <ArrowRight className="h-4 w-4" />
                            <span className="mx-2">{c.nav.back}</span>
                        </Button>
                        
                        {
                            isLastStep ? (
                                <Button type="button" onClick={handleNext}>
                                    <span className="mx-2">{c.nav.results}</span>
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            ) : (
                                <Button type="button" onClick={handleNext}>
                                    <span className="mx-2">{c.nav.next}</span>
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            )
                        }
                    </div>
                </form>
            </FormProvider>
        </div>
    </div>
  );
}

