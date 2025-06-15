
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { guestFeedbackSchema, GuestFeedbackFormData } from "@/lib/validations/guestFeedback";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

// Import refactored field components
import { FirstNameField } from "./GuestFeedbackFormFields/FirstNameField";
import { LastNameField } from "./GuestFeedbackFormFields/LastNameField";
import { EmailField } from "./GuestFeedbackFormFields/EmailField";
import { VisitDateField } from "./GuestFeedbackFormFields/VisitDateField";
import { RatingField } from "./GuestFeedbackFormFields/RatingField";
import { FeedbackField } from "./GuestFeedbackFormFields/FeedbackField";
import { ConsentToShareField } from "./GuestFeedbackFormFields/ConsentToShareField";

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

    fetch("/functions/v1/generate_review_response", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        feedbackId: dbData.id,
        feedback: data.feedback,
        rating: data.rating,
      }),
    }).then(() => {
      // No-op, show success regardless of response
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
          <FirstNameField />
          <LastNameField />
          <EmailField />
        </div>
        <VisitDateField />
        <RatingField />
        <FeedbackField />
        <ConsentToShareField />
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
