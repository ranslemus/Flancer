import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Flancer</h3>
            <p className="text-sm text-muted-foreground">
              Connecting emerging tech talent with clients who value fresh perspectives.
            </p>
            <div className="mt-4 flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-base font-semibold">For Clients</h3>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              How to Hire
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Post a Job
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Find Freelancers
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Payment Methods
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-base font-semibold">For Freelancers</h3>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Find Work
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Create Profile
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Build Portfolio
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Success Stories
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-base font-semibold">Resources</h3>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Help Center
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Blog
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Community
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Tutorials
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-base font-semibold">Company</h3>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              About Us
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Careers
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Press
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Contact Us
            </Link>
          </div>
        </div>

        <div className="mt-10 border-t pt-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Flancer. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="#" className="text-xs text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-primary">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
