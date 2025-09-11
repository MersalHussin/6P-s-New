
"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { UserData } from "@/lib/types";
import { User, Mail, Smartphone, Briefcase, GraduationCap, School } from "lucide-react";
import { DeleteAccountDialog } from "./DeleteAccountDialog";
import { useLanguage } from "@/context/language-context";

const content = {
    ar: {
        title: "الملف الشخصي",
        description: "تفاصيل حسابك وبيانات الرحلة الخاصة بك.",
        name: "الاسم",
        email: "البريد الإلكتروني",
        whatsapp: "واتساب",
        education: "الحالة الدراسية",
        school: "المدرسة/الجامعة",
        job: "الوظيفة",
    },
    en: {
        title: "Profile",
        description: "Your account details and journey data.",
        name: "Name",
        email: "Email",
        whatsapp: "WhatsApp",
        education: "Education Status",
        school: "School/University",
        job: "Job",
    }
}
  

interface UserProfileDialogProps {
  children: React.ReactNode;
  userData: UserData;
}

export function UserProfileDialog({ children, userData }: UserProfileDialogProps) {
    const { language } = useLanguage();
    const c = content[language];
    
    const InfoRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | undefined }) => (
        <div className="flex items-start gap-3">
            <span className="mt-1 text-muted-foreground">{icon}</span>
            <div className="flex-grow">
                <p className="text-sm font-semibold text-muted-foreground">{label}</p>
                <p className="text-md font-medium">{value || "N/A"}</p>
            </div>
        </div>
    );
    
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <DialogHeader>
                    <DialogTitle>{c.title}</DialogTitle>
                    <DialogDescription>{c.description}</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <InfoRow icon={<User size={16}/>} label={c.name} value={userData.name} />
                    <InfoRow icon={<Mail size={16}/>} label={c.email} value={userData.email} />
                    <InfoRow icon={<Smartphone size={16}/>} label={c.whatsapp} value={userData.whatsapp} />
                    <InfoRow icon={<GraduationCap size={16}/>} label={c.education} value={userData.educationStatus} />
                    <InfoRow icon={<School size={16}/>} label={c.school} value={userData.school} />
                    <InfoRow icon={<Briefcase size={16}/>} label={c.job} value={userData.job} />
                </div>
                <div className="mt-4 pt-4 border-t flex justify-end">
                    <DeleteAccountDialog />
                </div>
            </DialogContent>
        </Dialog>
    )
}
