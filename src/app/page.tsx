
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MoveLeft, MoveRight } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { content } from "@/lib/content";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Loader2 } from "lucide-react";
import { AppHeader } from "@/components/layout/Header";


export default function Home() {
  const { language } = useLanguage();
  const c = content[language];
  const ArrowIcon = language === 'ar' ? MoveLeft : MoveRight;
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStartJourney = () => {
    if (user) {
        router.push('/journey');
    } else {
        router.push('/auth/user/signin');
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AppHeader />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative text-center py-20 md:py-32 lg:py-40 flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
             <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_500px_at_50%_200px,hsl(var(--primary)/0.1),transparent)]"></div>
          </div>
          <div className="container px-4 z-0">
            <h1 className="text-4xl md:text-6xl font-headline font-extrabold text-primary leading-tight tracking-tighter">
              {c.hero.title}
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
              {c.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
               <Button onClick={handleStartJourney} size="lg" className="font-headline font-bold text-lg shadow-lg shadow-primary/20" disabled={loading}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin"/> : (
                  <>
                    {c.cta}
                  </>
                )}
              </Button>
              <Link href="/certificate/check" passHref>
                  <Button variant="outline">{c.verifyCertificate}</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section className="py-12 md:py-20 bg-muted ">
            <div className="container px-4 m-auto">
                <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-2xl shadow-primary/10 max-w-4xl mx-auto">
                    <CardHeader className="text-center">
                        <h2 className="text-3xl font-headline font-bold text-primary">
                        {c.title}
                        </h2>
                        <p className="text-muted-foreground font-body text-lg mt-2">
                        {c.subtitle}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full aspect-video rounded-lg overflow-hidden border shadow-inner">
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/PR-gESOEbSQ"
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>


        {/* How it works Section */}
        <section className="py-16 md:py-24 bg-background">
            <div className="container px-4 text-center m-auto">
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-primary">
                    {c.howItWorks.title}
                </h2>
                <p className="mt-4 max-w-3xl mx-auto text-muted-foreground md:text-lg">
                    {c.howItWorks.description}
                </p>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  justify-items-center gap-8">
                    {c.stations.map((station) => {
                        const Icon = station.icon;
                        return (
                            <Card key={station.id} className=" max-w-[400px] text-center hover:shadow-lg hover:-translate-y-1 transition-transform duration-300">
                                <CardHeader>
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                                        <Icon className="h-6 w-6 text-primary"/>
                                    </div>
                                    <CardTitle className="font-headline text-2xl flex flex-col items-center">
                                        <span>{station.name}</span>
                                        {language === 'ar' && station.englishName && (
                                            <span className="text-lg text-muted-foreground font-normal">({station.englishName})</span>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{station.description('')}</p>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto text-center space-y-2">
            <p className="font-bold text-lg">
                {c.footer.developed_by_pre}
                <a href={c.footer.developed_by_link} target="_blank" rel="noopener noreferrer" className="hover:underline transition-opacity">
                    {c.footer.developed_by_name}
                </a>
            </p>
            <p className="text-sm opacity-80">
                {c.footer.copyright_pre}
                <a href={c.footer.copyright_link} target="_blank" rel="noopener noreferrer" className="hover:underline transition-opacity">
                    {c.footer.copyright_name}
                </a>
            </p>
        </div>
      </footer>
    </div>
  );
}

    




