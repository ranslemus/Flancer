"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle, X } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const AVAILABLE_SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Vue.js",
  "Angular",
  "Node.js",
  "Python",
  "Java",
  "PHP",
  "Ruby",
  "Go",
  "HTML/CSS",
  "Tailwind CSS",
  "Bootstrap",
  "SASS/SCSS",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Firebase",
  "AWS",
  "Google Cloud",
  "Azure",
  "Docker",
  "UI/UX Design",
  "Figma",
  "Adobe XD",
  "Photoshop",
  "Mobile Development",
  "React Native",
  "Flutter",
  "Swift",
  "DevOps",
  "CI/CD",
  "Testing",
  "Git/GitHub",
  "WordPress",
  "Shopify",
  "E-commerce",
  "SEO",
  "Data Analysis",
  "Machine Learning",
  "AI",
  "Blockchain",
]

export default function FreelancerSetup() {
  const [currentStep, setCurrentStep] = useState(1)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [bio, setBio] = useState("")

  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUser(user)

        // Check if user is already a freelancer
        const { data: client, error: clientError } = await supabase
          .from("client")
          .select("role")
          .eq("user_id", user.id)
          .single()

        if (!clientError && client && client.role === "freelancer") {
          // User is already a freelancer, redirect to dashboard
          console.log("User is already a freelancer, redirecting to dashboard")
          window.location.href = "/dashboard"
          return
        }
      } else {
        window.location.href = "/auth/login"
      }
      setLoading(false)
    }
    getUser()
  }, [])

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  const handleFinishSetup = async () => {
    if (!user) return

    setSaving(true)
    try {
      // Update freelancer with skills and bio
      const { error: freelancerError } = await supabase
        .from("freelancer")
        .update({
          skills: selectedSkills,
          bio: bio,
        })
        .eq("user_id", user.id)

      if (freelancerError) {
        console.error("Error updating freelancer:", freelancerError)
        alert("Error updating freelancer profile")
        setSaving(false)
        return
      }

      // Update client role to freelancer
      const { error: clientRoleError } = await supabase
        .from("client")
        .update({ role: "freelancer" })
        .eq("user_id", user.id)

      if (clientRoleError) {
        console.error("Error updating client role:", clientRoleError)
        alert("Error updating user role")
        setSaving(false)
        return
      }

      window.location.href = "/dashboard"
    } catch (error) {
      console.error("Error in handleFinishSetup:", error)
      alert("An unexpected error occurred")
    } finally {
      setSaving(false)
    }
  }

  const canProceedToStep2 = selectedSkills.length >= 2
  const canFinish = bio.trim().length > 0

  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading setup...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Complete Your Freelancer Profile</h1>
        <p className="text-muted-foreground mt-2">
          Let's set up your freelancer profile to start receiving job opportunities. After completing this setup, your
          role will be changed to freelancer.
        </p>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Step {currentStep} of 2</span>
          <span className="text-sm text-muted-foreground">{Math.round((currentStep / 2) * 100)}% Complete</span>
        </div>
        <Progress value={(currentStep / 2) * 100} className="h-2" />
      </div>

      {/* Step 1: Skills Selection */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Your Skills</CardTitle>
            <CardDescription>
              Choose at least 2 skills that represent your expertise. These will help clients find you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base font-medium">
                Available Skills ({selectedSkills.length} selected, minimum 2 required)
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
                {AVAILABLE_SKILLS.map((skill) => (
                  <Button
                    key={skill}
                    variant={selectedSkills.includes(skill) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSkillToggle(skill)}
                    className="justify-start h-auto py-2 px-3"
                  >
                    {skill}
                    {selectedSkills.includes(skill) && <CheckCircle className="ml-2 h-4 w-4" />}
                  </Button>
                ))}
              </div>
            </div>

            {selectedSkills.length > 0 && (
              <div>
                <Label className="text-base font-medium">Selected Skills:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSkills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1">
                      {skill}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => handleSkillToggle(skill)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={() => setCurrentStep(2)} disabled={!canProceedToStep2} className="min-w-32">
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Bio */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Write Your Bio</CardTitle>
            <CardDescription>
              Tell potential clients about yourself, your experience, and what makes you unique.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="bio" className="text-base font-medium">
                Professional Bio
              </Label>
              <Textarea
                id="bio"
                placeholder="I'm a passionate developer with 5+ years of experience in web development. I specialize in creating modern, responsive websites using React and Node.js..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="mt-2 min-h-32"
                maxLength={500}
              />
              <p className="text-sm text-muted-foreground mt-1">{bio.length}/500 characters</p>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button onClick={handleFinishSetup} disabled={!canFinish || saving} className="min-w-32">
                {saving ? "Setting up..." : "Complete Setup & Become Freelancer"}
                {!saving && <CheckCircle className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
