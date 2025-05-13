"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  budgetMin: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Budget must be a number.",
  }),
  budgetMax: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Budget must be a number.",
  }),
  deadline: z.string().optional(),
})

export default function PostJobPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      budgetMin: "",
      budgetMax: "",
      deadline: "",
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
          description: "You must be logged in to post a job.",
        })
        router.push("/auth/login")
        return
      }

      // Create job
      const { data, error } = await supabase
        .from("jobs")
        .insert({
          title: values.title,
          description: values.description,
          budget_min: Number(values.budgetMin),
          budget_max: Number(values.budgetMax),
          deadline: values.deadline ? new Date(values.deadline).toISOString() : null,
          client_id: user.id,
          status: "open",
        })
        .select()

      if (error) {
        throw error
      }

      toast({
        title: "Job posted successfully",
        description: "Your job has been posted and is now visible to freelancers.",
      })

      router.push("/jobs/my-jobs")
    } catch (error) {
      console.error("Error posting job:", error)
      toast({
        variant: "destructive",
        title: "Error posting job",
        description: "There was an error posting your job. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-3xl px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Post a Job</h1>
        <p className="text-muted-foreground">Create a new job posting to find talented freelancers</p>
      </div>

      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>Provide details about your job to attract the right freelancers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Website Redesign" {...field} />
                    </FormControl>
                    <FormDescription>A clear title will help freelancers understand your project.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your project in detail..." className="min-h-32" {...field} />
                    </FormControl>
                    <FormDescription>
                      Include specific requirements, deliverables, and any relevant details.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="budgetMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Budget ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 500" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budgetMax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Budget ($)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 1000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>When do you need this project completed?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Posting..." : "Post Job"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
