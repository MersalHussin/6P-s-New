
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User as UserIcon } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { countries } from '@/lib/countries';
import { cn } from '@/lib/utils';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const content = {
    ar: {
        title: "أهلاً بك في مسار الشغف!",
        description: "خطوات بسيطة تفصلك عن بدء رحلتك. نحتاج بعض المعلومات الأساسية عنك.",
        nameLabel: "الاسم الكامل",
        namePlaceholder: "مثال: محمد أحمد",
        whatsappLabel: "رقم الواتساب",
        phonePlaceholder: "1234567890",
        educationStatusLabel: "حالتك الدراسية الحالية",
        student: "طالب",
        graduate: "متخرج",
        other: "أخرى",
        otherEducationPlaceholder: "مثال: طالب دراسات عليا",
        schoolLabel: "اسم جامعتك أو مدرستك",
        schoolPlaceholder: "مثال: جامعة القاهرة",
        jobLabel: "وظيفتك الحالية (اختياري)",
        jobPlaceholder: "مثال: مطور برمجيات",
        submitButton: "حفظ والبدء في الرحلة",
        toastSuccessTitle: "تم حفظ بياناتك بنجاح!",
        toastSuccessDescription: "جاري تحضير رحلتك...",
        toastErrorTitle: "فشل حفظ البيانات",
    },
    en: {
        title: "Welcome to Passion Path!",
        description: "Just a few simple steps before you start your journey. We need some basic information about you.",
        nameLabel: "Full Name",
        namePlaceholder: "e.g. John Doe",
        whatsappLabel: "WhatsApp Number",
        phonePlaceholder: "1234567890",
        educationStatusLabel: "Your Current Educational Status",
        student: "Student",
        graduate: "Graduate",
        other: "Other",
        otherEducationPlaceholder: "e.g. Postgraduate Student",
        schoolLabel: "Your University or School Name",
        schoolPlaceholder: "e.g. Harvard University",
        jobLabel: "Current Job (Optional)",
        jobPlaceholder: "e.g. Software Developer",
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
        countryCode: z.string(),
        phone: z.string().min(8, { message: language === 'ar' ? 'رقم الهاتف قصير جدًا.' : 'Phone number is too short.' }),
        educationStatus: z.string({ required_error: language === 'ar' ? 'الرجاء اختيار حالتك الدراسية.' : 'Please select your education status.' }),
        otherEducationStatus: z.string().optional(),
        school: z.string().min(2, { message: language === 'ar' ? 'اسم الجامعة/المدرسة قصير جدًا.' : 'School/University name is too short.' }),
        job: z.string().optional(),
    }).refine(data => {
        if (data.educationStatus === 'other') {
            return data.otherEducationStatus && data.otherEducationStatus.length > 2;
        }
        return true;
    }, {
        message: language === 'ar' ? 'يرجى تحديد حالتك الدراسية الأخرى.' : 'Please specify your other education status.',
        path: ['otherEducationStatus'],
    });

    const form = useForm<z.infer<typeof onboardingSchema>>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
            name: '',
            countryCode: '+20',
            phone: '',
            school: '',
            job: '',
        },
    });
    
    const educationStatus = form.watch('educationStatus');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists() && userDoc.data().name) {
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

    const handleOnboardingSubmit = (values: z.infer<typeof onboardingSchema>) => {
        if (!user) return;
        form.clearErrors();
        setLoading(true);

        const finalEducationStatus = values.educationStatus === 'other' 
            ? values.otherEducationStatus 
            : values.educationStatus;

        const userData = {
            id: user.uid,
            email: user.email,
            name: values.name,
            whatsapp: `${values.countryCode}${values.phone}`,
            educationStatus: finalEducationStatus,
            school: values.school,
            job: values.job,
            createdAt: serverTimestamp(),
            lastUpdated: serverTimestamp(),
            currentStation: 'passions'
        };

        const userDocRef = doc(db, "users", user.uid);
        
        setDoc(userDocRef, userData, { merge: true }).then(() => {
             toast({
                title: c.toastSuccessTitle,
                description: c.toastSuccessDescription,
            });
            router.push('/journey');
        }).catch(async (serverError: any) => {
            const permissionError = new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'create',
                requestResourceData: userData,
            });
            errorEmitter.emit('permission-error', permissionError);
            setLoading(false);
        });
    };

    if (loading && !user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <Card className="w-full max-w-lg mx-auto">
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
                                            <Input placeholder={c.namePlaceholder} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <div className="space-y-2">
                                <Label>{c.whatsappLabel}</Label>
                                <div className="flex gap-2" dir="ltr">
                                    <FormField
                                        control={form.control}
                                        name="countryCode"
                                        render={({ field }) => (
                                            <FormItem className="w-1/3">
                                                <Select
                                                  onValueChange={(value) => {
                                                    // Extract the dial_code which is after the #
                                                    const dialCode = value.split('#')[1];
                                                    field.onChange(dialCode);
                                                  }}
                                                  defaultValue={`${countries.find(c => c.dial_code === field.value)?.code || 'EG'}#${field.value}`}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Code" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {countries.map(country => (
                                                            <SelectItem key={country.code} value={`${country.code}#${country.dial_code}`}>
                                                                {country.flag} {country.dial_code}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem className="flex-grow">
                                                <FormControl>
                                                    <Input type="tel" placeholder={c.phonePlaceholder} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                           
                            <FormField
                                control={form.control}
                                name="educationStatus"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>{c.educationStatusLabel}</FormLabel>
                                        <div className="grid grid-cols-3 gap-2">
                                            <Button type="button" variant={field.value === 'student' ? 'default' : 'outline'} onClick={() => field.onChange('student')}>{c.student}</Button>
                                            <Button type="button" variant={field.value === 'graduate' ? 'default' : 'outline'} onClick={() => field.onChange('graduate')}>{c.graduate}</Button>
                                            <Button type="button" variant={field.value === 'other' ? 'default' : 'outline'} onClick={() => field.onChange('other')}>{c.other}</Button>
                                        </div>
                                        {educationStatus === 'other' && (
                                            <FormField
                                                control={form.control}
                                                name="otherEducationStatus"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input placeholder={c.otherEducationPlaceholder} {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}
                                         <FormMessage className="pt-2" />
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
                                            <Input placeholder={c.schoolPlaceholder} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="job"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{c.jobLabel}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={c.jobPlaceholder} {...field} />
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

    