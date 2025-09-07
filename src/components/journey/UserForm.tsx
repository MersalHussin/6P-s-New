"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useLanguage } from "@/context/language-context";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

const content = {
  ar: {
    title: "ابدأ رحلتك",
    description: "خطوة أخيرة قبل أن تبدأ. الرجاء إدخال بياناتك للمتابعة.",
    nameLabel: "الاسم",
    namePlaceholder: "اسمك الكامل",
    whatsappLabel: "رقم الواتساب",
    whatsappPlaceholder: "مثال: 9665xxxxxxxx",
    emailLabel: "البريد الإلكتروني (اختياري)",
    emailPlaceholder: "example@mail.com",
    cta: "ابدأ الآن",
    loading: "جاري الحفظ...",
    successToast: "تم حفظ بياناتك بنجاح!",
    errorToast: "حدث خطأ أثناء حفظ البيانات. حاول مرة أخرى.",
    validation: {
      nameRequired: "الاسم مطلوب",
      whatsappRequired: "رقم الواتساب مطلوب",
      whatsappInvalid: "رقم الواتساب غير صحيح",
      emailInvalid: "البريد الإلكتروني غير صحيح",
    },
  },
  en: {
    title: "Start Your Journey",
    description: "One last step before you begin. Please enter your details to continue.",
    nameLabel: "Name",
    namePlaceholder: "Your full name",
    whatsappLabel: "WhatsApp Number",
    whatsappPlaceholder: "e.g., 9665xxxxxxxx",
    emailLabel: "Email (Optional)",
    emailPlaceholder: "example@mail.com",
    cta: "Start Now",
    loading: "Saving...",
    successToast: "Your data has been saved successfully!",
    errorToast: "An error occurred while saving. Please try again.",
    validation: {
      nameRequired: "Name is required",
      whatsappRequired: "WhatsApp number is required",
      whatsappInvalid: "Invalid WhatsApp number",
      emailInvalid: "Invalid email address",
    },
  },
};

const USER_ID_KEY = "passionJourneyUserId_v2";

export function UserForm({ onUserCreated }: { onUserCreated: (userId: string) => void }) {
  const { language } = useLanguage();
  const c = content[language];
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    name: z.string().min(2, { message: c.validation.nameRequired }),
    whatsapp: z.string().min(10, { message: c.validation.whatsappInvalid }),
    email: z.string().email({ message: c.validation.emailInvalid }).optional().or(z.literal('')),
  });

  type UserFormValues = z.infer<typeof formSchema>;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      whatsapp: "",
      email: "",
    },
  });

  const handleFormSubmit = async (data: UserFormValues) => {
    setIsLoading(true);
    try {
      const docRef = await addDoc(collection(db, "users"), {
        ...data,
        createdAt: serverTimestamp(),
        currentStation: "user-data",
        journeyData: [],
      });
      
      localStorage.setItem(USER_ID_KEY, docRef.id);
      
      toast({
        title: c.successToast,
      });

      onUserCreated(docRef.id);

    } catch (error) {
      console.error("Error adding document: ", error);
      toast({
        title: c.errorToast,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{c.title}</DialogTitle>
        <DialogDescription>{c.description}</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
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
          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{c.whatsappLabel}</FormLabel>
                <FormControl>
                  <Input placeholder={c.whatsappPlaceholder} {...field} dir="ltr" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{c.emailLabel}</FormLabel>
                <FormControl>
                  <Input placeholder={c.emailPlaceholder} {...field} dir="ltr" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <DialogFooter>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? c.loading : c.cta}
          </Button>
        </DialogFooter>
        </form>
      </Form>
    </>
  );
}
