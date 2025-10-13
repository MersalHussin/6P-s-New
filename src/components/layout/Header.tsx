
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import type { UserData } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Globe, LogOut, User as UserIcon, Loader2, MoveLeft, RefreshCw, Home, ShieldQuestion, HelpCircle } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { UserProfileDialog } from "@/components/journey/UserProfileDialog";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

const content = {
  ar: {
    home: "الصفحة الرئيسية",
    signOut: "تسجيل الخروج",
    profile: "الملف الشخصي",
    restartJourney: "إعادة الرحلة",
    startJourney: "ابدأ رحلتك",
    help: "مساعدة",
    helpDialogTitle: "كيف تستخدم المنصة؟",
    exitWarning: {
      title: "هل أنت متأكد من رغبتك في الخروج؟",
      description: "سيتم تسجيل خروجك من حسابك.",
      cancel: "إلغاء",
      confirm: "تأكيد الخروج",
    },
    restartWarning: {
        title: "هل أنت متأكد من إعادة الرحلة؟",
        description: "سيتم حذف جميع بيانات رحلتك الحالية والبدء من جديد. لا يمكن التراجع عن هذا الإجراء.",
        confirm: "نعم، أعد الرحلة",
    },
    logoClickWarning: {
        title: "العودة إلى الصفحة الرئيسية",
        description: "هل تريد الخروج من الرحلة الحالية؟ لا تقلق، تقدمك محفوظ ويمكنك المتابعة لاحقًا.",
        confirm: "نعم، اخرج",
    }
  },
  en: {
    home: "Home",
    signOut: "Sign Out",
    profile: "Profile",
    restartJourney: "Restart Journey",
    startJourney: "Start Your Journey",
    help: "Help",
    helpDialogTitle: "How to use the platform?",
    exitWarning: {
      title: "Are you sure you want to sign out?",
      description: "You will be logged out of your account.",
      cancel: "Cancel",
      confirm: "Confirm Sign Out",
    },
    restartWarning: {
        title: "Are you sure you want to restart?",
        description: "All of your current journey data will be deleted and you will start over. This action cannot be undone.",
        confirm: "Yes, restart",
    },
    logoClickWarning: {
        title: "Return to Home Page",
        description: "Are you sure you want to exit the current journey? Don't worry, your progress is saved and you can continue later.",
        confirm: "Yes, exit",
    }
  },
};

const LogoLink = ({ isJourneyPage, c }: { isJourneyPage: boolean, c: any }) => {
    const router = useRouter();

    if (isJourneyPage) {
        return (
             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <div className="relative h-10 w-40 cursor-pointer">
                        <Image src="https://i.suar.me/1AxXY/l" alt="Passion Path Logo" fill style={{ objectFit: 'contain' }}/>
                    </div>
                </AlertDialogTrigger>
                <AlertDialogContent dir={c.logoClickWarning.title === "العودة إلى الصفحة الرئيسية" ? "rtl" : "ltr"}>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2"><ShieldQuestion/> {c.logoClickWarning.title}</AlertDialogTitle>
                        <AlertDialogDescription>{c.logoClickWarning.description}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{c.exitWarning.cancel}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => router.push('/')}>{c.logoClickWarning.confirm}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
             </AlertDialog>
        );
    }

    return (
        <Link href="/" passHref>
            <div className="relative h-10 w-40 cursor-pointer">
                <Image src="https://i.suar.me/1AxXY/l" alt="Passion Path Logo" fill style={{ objectFit: 'contain' }}/>
            </div>
        </Link>
    );
}

export function AppHeader() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const c = content[language];
  const ArrowIcon = language === 'ar' ? MoveLeft : MoveLeft;
  
  const isJourneyPage = pathname.startsWith('/journey');


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/');
  };

  const handleRestartJourney = () => {
    if (!user) return;
    
    const userDocRef = doc(db, "users", user.uid);
    const dataToUpdate = {
        journeyData: [],
        resultsData: null,
        currentStation: 'passions'
    };

    updateDoc(userDocRef, dataToUpdate)
        .then(() => {
            window.location.href = '/journey';
        })
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'update',
                requestResourceData: dataToUpdate,
            });
            errorEmitter.emit('permission-error', permissionError);
        });
  }

  const handleStartJourney = () => {
    if (user) {
        router.push('/journey');
    } else {
        router.push('/auth/user/signin');
    }
  };

  return (
    <header className="py-4 border-b sticky top-0 z-50 bg-background/95 backdrop-blur-sm" dir="ltr">
      <div className="container mx-auto flex justify-between items-center px-4 md:px-6">
        <div className="flex flex-1 items-center justify-start gap-4">
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                    <Globe className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Change language</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setLanguage('ar')}>
                    العربية
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage('en')}>
                    English
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

        <div className="flex justify-center">
            <LogoLink isJourneyPage={isJourneyPage} c={c}/>
        </div>
        
        <div className="flex flex-1 items-center justify-end gap-4">
        {loading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
        ) : user && userData ? (
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer h-9 w-9">
                <AvatarImage src={user.photoURL || undefined} />
                <AvatarFallback>
                    {userData.name ? userData.name.charAt(0).toUpperCase() : <UserIcon/>}
                </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mr-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <DropdownMenuLabel>
                <div className="font-normal text-sm text-muted-foreground">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <UserProfileDialog userData={userData}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <UserIcon className={cn("h-4 w-4", language === 'ar' ? "ml-2" : "mr-2")} />
                        <span>{c.profile}</span>
                </DropdownMenuItem>
                </UserProfileDialog>
                <Dialog>
                <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <HelpCircle className={cn("h-4 w-4", language === 'ar' ? "ml-2" : "mr-2")} />
                        <span>{c.help}</span>
                    </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{c.helpDialogTitle}</DialogTitle>
                    </DialogHeader>
                    <div className="aspect-video">
                        <iframe 
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/Fzzs5vrE5e0" 
                            title="YouTube video player" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen>
                        </iframe>
                    </div>
                </DialogContent>
                </Dialog>
                <AlertDialog>
                <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <RefreshCw className={cn("h-4 w-4", language === 'ar' ? "ml-2" : "mr-2")} />
                        <span>{c.restartJourney}</span>
                    </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent dir={language === 'ar' ? 'rtl' : 'ltr'}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{c.restartWarning.title}</AlertDialogTitle>
                        <AlertDialogDescription>{c.restartWarning.description}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{c.exitWarning.cancel}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRestartJourney}>{c.restartWarning.confirm}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>
                <DropdownMenuSeparator />
                <AlertDialog>
                <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                    <LogOut className={cn("h-4 w-4", language === 'ar' ? "ml-2" : "mr-2")} />
                    <span>{c.signOut}</span>
                    </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent dir={language === 'ar' ? 'rtl' : 'ltr'}>
                    <AlertDialogHeader>
                    <AlertDialogTitle>{c.exitWarning.title}</AlertDialogTitle>
                    <AlertDialogDescription>{c.exitWarning.description}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>{c.exitWarning.cancel}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSignOut}>
                        {c.exitWarning.confirm}
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuContent>
            </DropdownMenu>
        ) : (
            <Button onClick={handleStartJourney}>
                {c.startJourney}
            </Button>
        )}
        </div>
    </div>
    </header>
  );
}

    