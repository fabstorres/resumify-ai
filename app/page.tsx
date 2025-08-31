import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  CheckIcon,
  StarIcon,
  TrendingUpIcon,
  FileTextIcon,
  BrainIcon,
  TargetIcon,
  BarChart3Icon,
  ClockIcon,
  SparklesIcon,
  RocketIcon,
  ZapIcon,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
              <FileTextIcon className="size-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Resumify AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-primary">
              Features
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-primary">
              Pricing
            </a>
            <a href="#testimonials" className="text-muted-foreground hover:text-primary">
              Reviews
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button size="sm" asChild>
              <a href="/builder">Get Started</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-6">
            <SparklesIcon className="size-3 mr-1" />
            AI-Powered Resume Builder
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
            Build Resumes That Get You <span className="gradient-text">Hired</span>
          </h1>
          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto leading-relaxed">
            Create professional, ATS-optimized resumes with advanced AI tailoring. Get job-specific suggestions and
            track which versions lead to interviews.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <a href="/builder">
                <RocketIcon className="size-4 mr-2" />
                Start Building Your Resume
              </a>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              View Examples
            </Button>
          </div>
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckIcon className="size-4 text-primary" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="size-4 text-primary" />
              <span>Free tier available</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="size-4 text-primary" />
              <span>ATS-optimized</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Every Job Seeker</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              From basic resume creation to advanced AI optimization, we have everything you need to land your dream
              job.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <BrainIcon className="size-8 text-primary mb-2" />
                <CardTitle>AI-Powered Suggestions</CardTitle>
                <CardDescription>
                  Get intelligent recommendations for content, phrasing, and formatting tailored to your industry.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <TargetIcon className="size-8 text-primary mb-2" />
                <CardTitle>Job-Specific Optimization</CardTitle>
                <CardDescription>
                  Advanced AI tailoring with keyword optimization for specific job postings and ATS systems.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3Icon className="size-8 text-primary mb-2" />
                <CardTitle>Performance Analytics</CardTitle>
                <CardDescription>
                  Track which resume versions lead to interviews and optimize your success rate.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <ClockIcon className="size-8 text-primary mb-2" />
                <CardTitle>Version History</CardTitle>
                <CardDescription>
                  Keep track of all your resume iterations with unlimited drafts and version control.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <FileTextIcon className="size-8 text-primary mb-2" />
                <CardTitle>Professional Templates</CardTitle>
                <CardDescription>
                  Choose from industry-specific templates designed to pass ATS screening and impress recruiters.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUpIcon className="size-8 text-primary mb-2" />
                <CardTitle>Application Tracking</CardTitle>
                <CardDescription>
                  Monitor your job applications with built-in reminders and follow-up suggestions.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Start free and upgrade when you need advanced features
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Tier */}
            <Card className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Free</CardTitle>
                  <Badge variant="outline">Get Started</Badge>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold gradient-text">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <CardDescription>Perfect for getting started with basic resume building</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckIcon className="size-4 text-primary" />
                    <span>Create 1–2 resumes/cover letters</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckIcon className="size-4 text-primary" />
                    <span>Basic AI suggestions (generic phrasing)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckIcon className="size-4 text-primary" />
                    <span>Add & store projects/experience</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckIcon className="size-4 text-primary" />
                    <span>Limited version tracking (last 2 versions)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckIcon className="size-4 text-primary" />
                    <span>Export as PDF</span>
                  </div>
                </div>
                <Button className="w-full bg-transparent" variant="outline">
                  Start Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Tier */}
            <Card className="relative border-primary shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  <ZapIcon className="size-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Pro</CardTitle>
                  <Badge>Best Value</Badge>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold gradient-text">$19</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <CardDescription>Advanced AI features for serious job seekers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckIcon className="size-4 text-primary" />
                    <span className="font-medium">Unlimited resumes & cover letters</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckIcon className="size-4 text-primary" />
                    <span className="font-medium">Advanced AI tailoring (job-specific suggestions)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckIcon className="size-4 text-primary" />
                    <span className="font-medium">Keyword optimization</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckIcon className="size-4 text-primary" />
                    <span className="font-medium">Full version history / unlimited drafts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckIcon className="size-4 text-primary" />
                    <span className="font-medium">Application tracking + reminders</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckIcon className="size-4 text-primary" />
                    <span className="font-medium">Priority access to new features</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckIcon className="size-4 text-primary" />
                    <span className="font-medium">Analytics: interview success tracking</span>
                  </div>
                </div>
                <Button className="w-full">Upgrade to Pro</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Job Seekers Worldwide</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              See how Resumify AI has helped thousands land their dream jobs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="size-4 fill-primary text-primary" />
                  ))}
                </div>
                <CardDescription className="leading-relaxed">
                  "The AI suggestions were spot-on for my industry. I got 3 interviews within a week of updating my
                  resume!"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">SJ</span>
                  </div>
                  <div>
                    <p className="font-medium">Sarah Johnson</p>
                    <p className="text-sm text-muted-foreground">Software Engineer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="size-4 fill-primary text-primary" />
                  ))}
                </div>
                <CardDescription className="leading-relaxed">
                  "The analytics feature helped me understand which resume version worked best. Finally got my dream job
                  at a Fortune 500 company!"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">MC</span>
                  </div>
                  <div>
                    <p className="font-medium">Michael Chen</p>
                    <p className="text-sm text-muted-foreground">Marketing Manager</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="size-4 fill-primary text-primary" />
                  ))}
                </div>
                <CardDescription className="leading-relaxed">
                  "As a recent graduate, I had no idea how to write a professional resume. Resumify AI guided me through
                  every step!"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">ER</span>
                  </div>
                  <div>
                    <p className="font-medium">Emily Rodriguez</p>
                    <p className="text-sm text-muted-foreground">Recent Graduate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build Your Perfect Resume?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of job seekers who have successfully landed their dream jobs with Resumify AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <a href="/builder">
                <SparklesIcon className="size-4 mr-2" />
                Start Building for Free
              </a>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              View Pro Features
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
                  <FileTextIcon className="size-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Resumify AI</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Build professional resumes with AI-powered optimization and land your dream job.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Templates
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Press
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground">© 2024 Resumify AI. All rights reserved.</p>
            <div className="flex items-center gap-4 text-muted-foreground">
              <a href="#" className="hover:text-primary">
                Twitter
              </a>
              <a href="#" className="hover:text-primary">
                LinkedIn
              </a>
              <a href="#" className="hover:text-primary">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
