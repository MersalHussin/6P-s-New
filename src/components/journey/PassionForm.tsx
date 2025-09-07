"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { PlusCircle, Trash2, Flame } from "lucide-react";

const passionFormSchema = z.object({
  passions: z.array(
    z.object({
      name: z.string().min(2, { message: "يجب أن يكون الشغف من حرفين على الأقل." }),
    })
  ).min(3, { message: "الرجاء إدخال 3 أنواع من الشغف على الأقل." }).max(6, { message: "يمكنك إدخال 6 أنواع من الشغف كحد أقصى." }),
});

type PassionFormValues = z.infer<typeof passionFormSchema>;

interface PassionFormProps {
  onSubmit: (passions: { name: string }[]) => void;
}

export function PassionForm({ onSubmit }: PassionFormProps) {
  const form = useForm<PassionFormValues>({
    resolver: zodResolver(passionFormSchema),
    defaultValues: {
      passions: [{ name: "" }, { name: "" }, { name: "" }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "passions",
  });

  const handleFormSubmit = (data: PassionFormValues) => {
    onSubmit(data.passions);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full">
                <Flame className="w-8 h-8" />
            </div>
            <div>
                <CardTitle className="font-headline text-2xl">المرحلة الأولى: حدد شغفك</CardTitle>
                <CardDescription>أدخل من 3 إلى 6 اهتمامات أو مجالات شغف تود استكشافها.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`passions.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <Input placeholder={`الشغف ${index + 1}`} {...field} className="text-base"/>
                      {fields.length > 3 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          aria-label="Remove passion"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
             {form.formState.errors.passions && fields.length > 0 && (
                <p className="text-sm font-medium text-destructive">{form.formState.errors.passions.message}</p>
             )}

            {fields.length < 6 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ name: "" })}
                className="w-full"
              >
                <PlusCircle className="ml-2 h-4 w-4" />
                إضافة شغف آخر
              </Button>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" size="lg">
              ابدأ رحلة الاستكشاف
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
