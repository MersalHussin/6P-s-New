"use client";

import type { UserData, PassionData } from "@/lib/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Award } from "lucide-react";

export function UserJourneyDetails({ user }: { user: UserData }) {
    const { name, whatsapp, email, journeyData, resultsData } = user;

    const renderFieldItems = (items: PassionData['purpose'] | undefined) => {
        if (!items || items.length === 0 || items.every(i => !i.text)) {
            return <p className="text-sm text-muted-foreground">No data provided.</p>;
        }
        return (
            <ul className="list-disc space-y-2 pl-5">
                {items.filter(i => i.text).map((item) => (
                    <li key={item.id}>
                        {item.text}
                        {item.weight && (
                            <Badge variant="secondary" className="ml-2">{item.weight}</Badge>
                        )}
                    </li>
                ))}
            </ul>
        );
    }
  
    return (
      <>
        <DialogHeader>
          <DialogTitle>Journey Details: {name}</DialogTitle>
          <DialogDescription>
            WhatsApp: {whatsapp} | Email: {email || "Not provided"}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
            
            {journeyData && journeyData.length > 0 ? (
                 <Accordion type="multiple" className="w-full">
                    {journeyData.map((passion) => (
                        <AccordionItem value={passion.id} key={passion.id}>
                            <AccordionTrigger className="text-xl font-semibold text-primary">{passion.name}</AccordionTrigger>
                            <AccordionContent className="space-y-4 pl-4">
                                <div>
                                    <h4 className="font-semibold text-lg mb-2">Purpose</h4>
                                    {renderFieldItems(passion.purpose)}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg mb-2">Power</h4>
                                    {renderFieldItems(passion.power)}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg mb-2">Proof</h4>
                                    {renderFieldItems(passion.proof)}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg mb-2">Problems</h4>
                                    {renderFieldItems(passion.problems)}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg mb-2">Possibilities</h4>
                                    {renderFieldItems(passion.possibilities)}
                                </div>
                                {passion.suggestedSolutions && passion.suggestedSolutions.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-lg mb-2">AI Suggested Solutions</h4>
                                        <ul className="list-decimal space-y-1 pl-5">
                                            {passion.suggestedSolutions.map((solution, index) => <li key={index}>{solution}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                 </Accordion>
            ) : (
                <p className="text-center text-muted-foreground">User has not entered any passion data yet.</p>
            )}

            {resultsData && resultsData.rankedPassions.length > 0 && (
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Award className="text-accent"/> Ranking Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {resultsData.rankedPassions.map((passion, index) => (
                             <Card key={passion.passion} className={`shadow-md ${index === 0 ? 'border-accent border-2' : ''}`}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-xl">{index + 1}. {passion.passion}</p>
                                            <p className="text-muted-foreground">Score: {passion.score}</p>
                                        </div>
                                        {index === 0 && <Badge className="bg-accent text-accent-foreground"><CheckCircle className="h-4 w-4 mr-1"/> Top Passion</Badge>}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <h5 className="font-semibold mb-1">Reasoning:</h5>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{passion.reasoning}</p>
                                </CardContent>
                             </Card>
                        ))}
                    </CardContent>
                 </Card>
            )}
        </div>
      </>
    );
}
