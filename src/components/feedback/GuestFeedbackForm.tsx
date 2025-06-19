
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { guestFeedbackSchema, GuestFeedbackFormData } from "@/lib/validations/guestFeedback";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { sendGuestFeedbackWebhook, formatDateForWebhook } from "@/utils/guestFeedbackWebhookService";

// Import refactored field components
import { FirstNameField } from "./GuestFeedbackFormFields/FirstNameField";
import { LastNameField } from "./GuestFeedbackFormFields/LastNameField";
import { EmailField } from "./GuestFeedbackFormFields/EmailField";
import { VisitDateField } from "./GuestFeedbackFormFields/VisitDateField";
import { RatingField } from "./GuestFeedbackFormFields/RatingField";
import { FeedbackField } from "./GuestFeedbackFormFields/FeedbackField";
import { ConsentToShareField } from "./GuestFeedbackFormFields/ConsentToShareField";

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

    try {
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

      // Send initial feedback webhook to Make.com (silent - no error handling shown to user)
      const webhookPayload = {
        guestName: name,
        email: data.email,
        visitDate: format(data.visitDate, "yyyy-MM-dd"),
        rating: data.rating,
        feedback: data.feedback,
        consentToShare: data.consentToShare,
        status: data.rating <= 3 ? "flagged" : "new",
        timestamp: new Date().toISOString(),
        formattedVisitDate: formatDateForWebhook(data.visitDate),
        feedbackId: dbData.id,
      };

      // Send webhook (completely silent)
      sendGuestFeedbackWebhook(webhookPayload).catch(() => {
        // Silent error handling - don't show anything to user
      });

      // Trigger AI response generation (silent - don't block user experience)
      try {
        await supabase.functions.invoke("generate_review_response", {
          body: {
            feedbackId: dbData.id,
            feedback: data.feedback,
            rating: data.rating,
            guestName: name,
            email: data.email,
            visitDate: format(data.visitDate, "yyyy-MM-dd"),
            consentToShare: data.consentToShare,
          },
        });
      } catch {
        // Silent error handling - AI generation failure doesn't affect user experience
      }

      // Always show success to user regardless of webhook/AI status
      setSuccess(true);
      setSubmitting(false);
      form.reset();
      toast({
        title: "Thanks for your feedback! We appreciate you.",
        description: "We'll use your comments to make Champions even better.",
        variant: "default",
      });

    } catch {
      toast({ 
        title: "Error", 
        description: "Could not submit feedback. Please try again.", 
        variant: "destructive" 
      });
      setSubmitting(false);
    }
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
