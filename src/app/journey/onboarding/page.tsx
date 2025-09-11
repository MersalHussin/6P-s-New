
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User as UserIcon } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

const content = {
    ar: {
        title: "أهلاً بك في مسار الشغف!",
        description: "خطوات بسيطة تفصلك عن بدء رحلتك. نحتاج بعض المعلومات الأساسية عنك.",
        nameLabel: "الاسم الكامل",
        whatsappLabel: "رقم الواتساب (مع كود الدولة)",
        whatsappPlaceholder: "+201234567890",
        educationStatusLabel: "حالتك الدراسية الحالية",
        student: "طالب",
        graduate: "متخرج",
        schoolLabel: "اسم جامعتك أو مدرستك",
        submitButton: "حفظ والبدء في الرحلة",
        toastSuccessTitle: "تم حفظ بياناتك بنجاح!",
        toastSuccessDescription: "جاري تحضير رحلتك...",
        toastErrorTitle: "فشل حفظ البيانات",
    },
    en: {
        title: "Welcome to Passion Path!",
        description: "Just a few simple steps before you start your journey. We need some basic information about you.",
        nameLabel: "Full Name",
        whatsappLabel: "WhatsApp Number (with country code)",
        whatsappPlaceholder: "+1234567890",
        educationStatusLabel: "Your Current Educational Status",
        student: "Student",
        graduate: "Graduate",
        schoolLabel: "Your University or School Name",
        submitButton: "Save and Start Journey",
        toastSuccessTitle: "Your data has been saved successfully!",
        toastSuccessDescription: "Preparing your journey...",
        toastErrorTitle: "Failed to save data",
    }
}

export default function OnboardingPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { toast } = useToast();
    const { language } = useLanguage();
    const c = content[language];

    const onboardingSchema = z.object({
        name: z.string().min(3, { message: language === 'ar' ? 'الاسم يجب أن يكون 3 أحرف على الأقل.' : 'Name must be at least 3 characters.' }),
        whatsapp: z.string().regex(/^\+[1-9]\d{1,14}$/, { message: language === 'ar' ? 'الرجاء إدخال رقم واتساب صحيح مع كود الدولة.' : 'Please enter a valid WhatsApp number with country code.' }),
        educationStatus: z.enum(['student', 'graduate'], { required_error: language === 'ar' ? 'الرجاء اختيار حالتك الدراسية.' : 'Please select your education status.' }),
        school: z.string().min(2, { message: language === 'ar' ? 'اسم الجامعة/المدرسة قصير جدًا.' : 'School/University name is too short.' }),
    });

    const form = useForm<z.infer<typeof onboardingSchema>>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
            name: '',
            whatsapp: '',
            school: '',
        },
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                // Check if user already has data
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists() && userDoc.data().name) {
                    // User has already completed onboarding, redirect them
                    router.push('/journey');
                } else {
                    setLoading(false);
                }
            } else {
                router.push('/auth/user/signin');
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleOnboardingSubmit = async (values: z.infer<typeof onboardingSchema>) => {
        if (!user) return;
        setLoading(true);
        try {
            await setDoc(doc(db, "users", user.uid), {
                id: user.uid,
                email: user.email,
                name: values.name,
                whatsapp: values.whatsapp,
                educationStatus: values.educationStatus,
                school: values.school,
                createdAt: serverTimestamp(),
                lastUpdated: serverTimestamp(),
                currentStation: 'passions'
            }, { merge: true });

            toast({
                title: c.toastSuccessTitle,
                description: c.toastSuccessDescription,
            });
            router.push('/journey');
        } catch (error: any) {
            toast({
                title: c.toastErrorTitle,
                description: error.message,
                variant: 'destructive',
            });
            setLoading(false);
        }
    };

    if (loading && !user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <Card className="w-full max-w-lg mx-4">
                <CardHeader className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                        <UserIcon className="h-8 w-8 text-primary"/>
                    </div>
                    <CardTitle className="text-2xl font-headline">{c.title}</CardTitle>
                    <CardDescription>{c.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleOnboardingSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{c.nameLabel}</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="whatsapp"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{c.whatsappLabel}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={c.whatsappPlaceholder} dir="ltr" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="educationStatus"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>{c.educationStatusLabel}</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="flex flex-col space-y-1"
                                            >
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="student" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        {c.student}
                                                    </FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value="graduate" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        {c.graduate}
                                                    </FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="school"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{c.schoolLabel}</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {c.submitButton}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

