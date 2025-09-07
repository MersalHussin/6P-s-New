"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Globe, MoveLeft, MoveRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/context/language-context";
import { content } from "@/lib/content";
import { UserForm } from "@/components/journey/UserForm";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { useRouter } from "next/navigation";


export default function Home() {
  const { language, setLanguage } = useLanguage();
  const c = content[language];
  const ArrowIcon = language === 'ar' ? MoveLeft : MoveRight;
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleUserFormSubmit = (userId: string) => {
    setIsDialogOpen(false);
    router.push('/journey');
  };


  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8 md:p-12">
      <div className="absolute top-4 right-4">
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
      </div>
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="w-full max-w-4xl mx-auto">
        <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-2xl shadow-primary/10">
          <CardHeader className="text-center">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
              {c.title}
            </h1>
            <p className="text-muted-foreground font-body text-lg mt-2">
              {c.subtitle}
            </p>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-8">
            <div className="w-full aspect-video rounded-lg overflow-hidden border shadow-inner">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/Fzzs5vrE5e0"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <p className="text-center font-body max-w-2xl text-foreground/80">
              {c.description}
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="font-headline font-bold text-lg">
                  {c.cta}
                  <ArrowIcon className={language === 'ar' ? "mr-2 h-5 w-5" : "ml-2 h-5 w-5"} />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                 <UserForm onUserCreated={handleUserFormSubmit} />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
