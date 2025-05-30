"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"

const formSchema = z.object({
  proposal: z.string().min(50, {
    message: "Proposal must be at least 50 characters.",
  }),
})

interface ApplyFormProps {
  jobId: string
}

export function ApplyForm({ jobId }: ApplyFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      proposal: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const supabase = createClient()

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication error",
          description: "You must be logged in to apply for jobs.",
        })
        router.push("/auth/login")
        return
      }

      // Submit application
      const { data, error } = await supabase
        .from("job_applications")
        .insert({
          job_id: jobId,
          freelancer_id: user.id,
          proposal: values.proposal,
          status: "pending",
        })
        .select()

      if (error) {
        throw error
      }

      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully.",
      })

      router.refresh()
    } catch (error) {
      console.error("Error submitting application:", error)
      toast({
        variant: "destructive",
        title: "Error submitting application",
        description: "There was an error submitting your application. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="proposal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Proposal</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Explain why you're the best fit for this job..."
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Include your relevant experience, approach to the project, and timeline.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </Form>
  )
}
