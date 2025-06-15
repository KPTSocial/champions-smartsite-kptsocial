
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { guestFeedbackSchema, GuestFeedbackFormData } from "@/lib/validations/guestFeedback";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

type DBFeedback = {
  id: string;
  name: string | null;
  email: string | null;
  visit_date: string;
  rating: number;
  feedback: string;
  consent_to_share: boolean;
  ai_response: string | null;
  status: string;
};

export const GuestFeedbackForm = () => {
  const form = useForm<GuestFeedbackFormData>({
    resolver: zodResolver(guestFeedbackSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      visitDate: undefined,
      rating: 5,
      feedback: "",
      consentToShare: false,
    },
  });
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: GuestFeedbackFormData) => {
    setSubmitting(true);
    setSuccess(false);

    // Join first and last name
    const name = data.lastName
      ? `${data.firstName.trim()} ${data.lastName.trim()}`
      : data.firstName.trim();

    // Insert feedback in DB with status and no AI response yet
    const { error, data: dbData } = await supabase
      .from("guest_feedback")
      .insert([
        {
          name: name,
          email: data.email,
          visit_date: format(data.visitDate, "yyyy-MM-dd"),
          rating: data.rating,
          feedback: data.feedback,
          consent_to_share: data.consentToShare,
          status: data.rating <= 3 ? "flagged" : "new",
        },
      ])
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: "Could not submit feedback.", variant: "destructive" });
      setSubmitting(false);
      return;
    }

    // Call AI edge function
    fetch("/functions/v1/generate_review_response", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        feedbackId: dbData.id,
        feedback: data.feedback,
        rating: data.rating,
      }),
    }).then(() => {
      // Don't rely on AI result here, just show success
    });

    setSuccess(true);
    setSubmitting(false);
    form.reset();
    toast({
      title: "Thanks for your feedback! We appreciate you.",
      description: "We'll use your comments to make Champions even better.",
      variant: "default",
    });
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <h3 className="text-2xl font-serif font-semibold mb-2">
          Thanks for your feedback! We appreciate you.
        </h3>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Jane" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name <span className="text-muted-foreground">(Optional)</span></FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
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
                <FormLabel>Email <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="visitDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visit Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  onChange={e => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                  value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Star Rating (1–5)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  step={1}
                  value={field.value}
                  onChange={e => field.onChange(Number(e.target.value))}
                  required
                  className="w-24"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="feedback"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Share Your Feedback</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="How was your experience?"
                  {...field}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="consentToShare"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 mt-2">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={e => field.onChange(e.target.checked)}
                  id="consent_to_share"
                  className="mr-2"
                />
              </FormControl>
              <FormLabel htmlFor="consent_to_share" className="text-sm font-normal">
                Okay to publicly share this review
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      </form>
    </Form>
  );
};
