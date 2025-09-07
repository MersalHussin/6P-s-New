import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MoveLeft } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8 md:p-12">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="w-full max-w-4xl mx-auto">
        <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-2xl shadow-primary/10">
          <CardHeader className="text-center">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
              Passion Path
            </h1>
            <p className="text-muted-foreground font-body text-lg mt-2">
              اكتشف شغفك وانطلق في رحلة الـ 6Ps
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
              تطبيق رحلة الـ 6Ps يساعدك على اكتشاف شغفك الحقيقي من خلال 6 مراحل أساسية. ابدأ رحلتك الآن لتحديد أهدافك، استغلال نقاط قوتك، ومواجهة التحديات لتحقيق إمكانياتك الكاملة.
            </p>
            <Link href="/journey" passHref>
              <Button size="lg" className="font-headline font-bold text-lg">
                <MoveLeft className="ml-2 h-5 w-5" />
                ابدأ رحلتك
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
