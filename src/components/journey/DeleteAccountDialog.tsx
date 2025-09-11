
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldAlert } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { EmailAuthProvider, reauthenticateWithCredential, deleteUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { useLanguage } from "@/context/language-context";

const content = {
    ar: {
        trigger: "حذف الحساب",
        title: "هل أنت متأكد تمامًا؟",
        description: "هذا الإجراء لا يمكن التراجع عنه. سيتم حذف حسابك وجميع بيانات رحلتك بشكل دائم.",
        description2: "لتأكيد الحذف، يرجى إدخال كلمة المرور الخاصة بك.",
        passwordLabel: "كلمة المرور",
        cancel: "إلغاء",
        confirm: "نعم، احذف حسابي",
        toastSuccess: "تم حذف حسابك بنجاح.",
        toastError: "فشل حذف الحساب",
        toastReauthError: "كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.",
    },
    en: {
        trigger: "Delete Account",
        title: "Are you absolutely sure?",
        description: "This action cannot be undone. This will permanently delete your account and all your journey data.",
        description2: "To confirm, please enter your password.",
        passwordLabel: "Password",
        cancel: "Cancel",
        confirm: "Yes, delete my account",
        toastSuccess: "Your account has been deleted successfully.",
        toastError: "Failed to delete account.",
        toastReauthError: "Incorrect password. Please try again.",
    }
}

export function DeleteAccountDialog() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { language } = useLanguage();
  const c = content[language];

  const handleDeleteAccount = async () => {
    setLoading(true);
    const user = auth.currentUser;

    if (!user || !user.email) {
      toast({ title: c.toastError, description: "User not found.", variant: "destructive" });
      setLoading(false);
      return;
    }

    const credential = EmailAuthProvider.credential(user.email, password);

    try {
      await reauthenticateWithCredential(user, credential);
      
      // After re-authentication, delete user data from Firestore
      await deleteDoc(doc(db, "users", user.uid));
      
      // Then delete the user from Firebase Auth
      await deleteUser(user);

      toast({ title: c.toastSuccess });
      setOpen(false);
      router.push('/'); // Redirect to home page

    } catch (error: any) {
      if (error.code === 'auth/wrong-password') {
        toast({ title: c.toastError, description: c.toastReauthError, variant: "destructive" });
      } else {
        toast({ title: c.toastError, description: error.message, variant: "destructive" });
      }
      console.error(error);
    } finally {
      setLoading(false);
      setPassword("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">{c.trigger}</Button>
      </DialogTrigger>
      <DialogContent dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <div className="flex items-center justify-center">
            <ShieldAlert className="h-12 w-12 text-destructive mb-4" />
          </div>
          <DialogTitle className="text-center">{c.title}</DialogTitle>
          <DialogDescription className="text-center">
            {c.description} <br/> {c.description2}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-4">
          <Label htmlFor="password">{c.passwordLabel}</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            dir="ltr"
          />
        </div>
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button variant="ghost">{c.cancel}</Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={loading || password.length === 0}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {c.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
