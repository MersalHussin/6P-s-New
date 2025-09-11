
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
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
import { Globe, LogOut, User as UserIcon, Loader2, MoveLeft } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { UserProfileDialog } from "@/components/journey/UserProfileDialog";

const content = {
  ar: {
    home: "الصفحة الرئيسية",
    signOut: "تسجيل الخروج",
    profile: "الملف الشخصي",
    startJourney: "ابدأ رحلتك",
    exitWarning: {
      title: "هل أنت متأكد من رغبتك في الخروج؟",
      description: "سيتم تسجيل خروجك من حسابك.",
      cancel: "إلغاء",
      confirm: "تأكيد الخروج",
    },
  },
  en: {
    home: "Home",
    signOut: "Sign Out",
    profile: "Profile",
    startJourney: "Start Your Journey",
    exitWarning: {
      title: "Are you sure you want to sign out?",
      description: "You will be logged out of your account.",
      cancel: "Cancel",
      confirm: "Confirm Sign Out",
    },
  },
};

export function AppHeader() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const c = content[language];
  const ArrowIcon = language === 'ar' ? MoveLeft : MoveLeft;


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

  const handleStartJourney = () => {
    if (user) {
        router.push('/journey');
    } else {
        router.push('/auth/user/signin');
    }
  };

  return (
    <header className="py-4 border-b sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" passHref>
            <div className="relative h-10 w-40 cursor-pointer">
                <Image src="https://i.suar.me/1AxXY/l" alt="Passion Path Logo" fill style={{ objectFit: 'contain' }}/>
            </div>
        </Link>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                <Globe className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Change language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage('ar')}>
                العربية
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                English
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
              <DropdownMenuContent align="end" className="w-56" dir={language === 'ar' ? 'rtl' : 'ltr'}>
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
                <ArrowIcon className={language === 'ar' ? "mr-2 h-5 w-5" : "ml-2 h-5 w-5"} />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
