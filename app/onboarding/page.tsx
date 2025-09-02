"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  UserIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  CodeIcon,
  PlusIcon,
  ArrowRightIcon,
  FileTextIcon,
  TrashIcon,
} from "lucide-react";
import { useConvexAuth, useMutation } from "convex/react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import type {
  PersonalInfo,
  Experience,
  Education,
  Project,
} from "@/lib/types/resume";

export default function OnboardingPage() {
  const { isAuthenticated } = useConvexAuth();
  const onboard = useMutation(api.user.onboard);
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
  });

  const [summary, setSummary] = useState("");

  const [experiences, setExperiences] = useState<Experience[]>([
    {
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ]);

  const [education, setEducation] = useState<Education[]>([
    {
      degree: "",
      school: "",
      location: "",
      graduationDate: "",
      gpa: "",
    },
  ]);

  const [projects, setProjects] = useState<Project[]>([
    {
      name: "",
      description: "",
      technologies: "",
      link: "",
    },
  ]);

  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h1 className="text-xl font-bold">Welcome!</h1>
        <p>Please sign in or sign up to continue.</p>
        <div className="flex space-x-4">
          <SignInButton mode="modal">
            <Button variant={"ghost"}>Sign In</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button variant={"default"}>Sign Up</Button>
          </SignUpButton>
        </div>
      </div>
    );
  }

  // --- CRUD helpers (same as before) ---
  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };
  const removeExperience = (index: number) =>
    setExperiences(experiences.filter((_, i) => i !== index));
  const updateExperience = (
    index: number,
    field: keyof Experience,
    value: string
  ) =>
    setExperiences(
      experiences.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      )
    );

  const addEducation = () => {
    setEducation([
      ...education,
      {
        degree: "",
        school: "",
        location: "",
        graduationDate: "",
        gpa: "",
      },
    ]);
  };
  const removeEducation = (index: number) =>
    setEducation(education.filter((_, i) => i !== index));
  const updateEducation = (
    index: number,
    field: keyof Education,
    value: string
  ) =>
    setEducation(
      education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      )
    );

  const addProject = () => {
    setProjects([
      ...projects,
      {
        name: "",
        description: "",
        technologies: "",
        link: "",
      },
    ]);
  };
  const removeProject = (index: number) =>
    setProjects(projects.filter((_, i) => i !== index));
  const updateProject = (index: number, field: keyof Project, value: string) =>
    setProjects(
      projects.map((proj, i) =>
        i === index ? { ...proj, [field]: value } : proj
      )
    );

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };
  const removeSkill = (skill: string) =>
    setSkills(skills.filter((s) => s !== skill));

  // --- Validation per step ---
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          personalInfo.name.trim() !== "" && personalInfo.email.trim() !== ""
        );
      case 2:
        return experiences.every(
          (exp) => exp.company.trim() !== "" && exp.title.trim() !== ""
        );
      case 3:
        return education.every(
          (edu) => edu.school.trim() !== "" && edu.degree.trim() !== ""
        );
      case 4:
        return projects.every((proj) => proj.name.trim() !== "");
      default:
        return true;
    }
  };

  // --- Final submit ---
  const handleFinish = async () => {
    try {
      await onboard({
        personalInfo: {
          ...personalInfo,
          phone: personalInfo.phone || "",
          location: personalInfo.location || "",
          linkedin: personalInfo.linkedin || "",
          github: personalInfo.github || "",
        },
        summary: summary || "",
        experience: experiences.map((exp) => ({
          ...exp,
          location: exp.location || "",
          startDate: exp.startDate || "",
          endDate: exp.endDate || "",
          description: exp.description || "",
        })),
        education: education.map((edu) => ({
          ...edu,
          location: edu.location || "",
          graduationDate: edu.graduationDate || "",
          gpa: edu.gpa || "",
        })),
        projects: projects.map((proj) => ({
          ...proj,
          description: proj.description || "",
          technologies: proj.technologies || "",
          link: proj.link || "",
        })),
        skills,
      });
      router.push("/builder");
    } catch (error) {
      console.error("Onboarding failed:", error);
      // TODO: add toast here
    }
  };

  // --- Skip (empty resume) ---
  const handleSkip = async () => {
    try {
      await onboard({
        personalInfo: {
          name: "",
          email: "",
          phone: "",
          location: "",
          linkedin: "",
          github: "",
        },
        summary: "",
        experience: [],
        education: [],
        projects: [],
        skills: [],
      });
      router.push("/builder");
    } catch (error) {
      console.error("Skip onboarding failed:", error);
      // TODO: add toast here
    }
  };

  const steps = [
    { number: 1, title: "Personal Info", icon: UserIcon },
    { number: 2, title: "Experience", icon: BriefcaseIcon },
    { number: 3, title: "Education", icon: GraduationCapIcon },
    { number: 4, title: "Projects & Skills", icon: CodeIcon },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
              <FileTextIcon className="size-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Resumify AI
            </span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                    currentStep === step.number
                      ? "bg-primary text-primary-foreground"
                      : currentStep > step.number
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <step.icon className="size-4" />
                  <span>{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRightIcon className="size-4 text-muted-foreground mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Step 1: Personal Info */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="size-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Let's start with your basic information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input
                    value={personalInfo.name}
                    onChange={(e) =>
                      setPersonalInfo({ ...personalInfo, name: e.target.value })
                    }
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        email: e.target.value,
                      })
                    }
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={personalInfo.phone}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        phone: e.target.value,
                      })
                    }
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={personalInfo.location}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        location: e.target.value,
                      })
                    }
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn</Label>
                  <Input
                    value={personalInfo.linkedin}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        linkedin: e.target.value,
                      })
                    }
                    placeholder="linkedin.com/in/johndoe"
                  />
                </div>
                <div className="space-y-2">
                  <Label>GitHub</Label>
                  <Input
                    value={personalInfo.github}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        github: e.target.value,
                      })
                    }
                    placeholder="github.com/johndoe"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Professional Summary</Label>
                <Textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Brief overview of your professional background and career goals..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Experience */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BriefcaseIcon className="size-5" />
                Work Experience
              </CardTitle>
              <CardDescription>
                Add your work experience. Start with your most recent position.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {experiences.map((exp, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Experience {index + 1}</h3>
                    {experiences.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(index)}
                      >
                        <TrashIcon className="size-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Company *</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) =>
                          updateExperience(index, "company", e.target.value)
                        }
                        placeholder="Google"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Job Title *</Label>
                      <Input
                        value={exp.title}
                        onChange={(e) =>
                          updateExperience(index, "title", e.target.value)
                        }
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        value={exp.location}
                        onChange={(e) =>
                          updateExperience(index, "location", e.target.value)
                        }
                        placeholder="Mountain View, CA"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) =>
                          updateExperience(index, "startDate", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) =>
                          updateExperience(index, "endDate", e.target.value)
                        }
                        placeholder="Leave blank if current"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={exp.description}
                      onChange={(e) =>
                        updateExperience(index, "description", e.target.value)
                      }
                      placeholder="Describe your responsibilities and achievements..."
                      rows={3}
                    />
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addExperience}
                className="w-full"
              >
                <PlusIcon className="size-4 mr-2" />
                Add Another Experience
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Education */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCapIcon className="size-5" />
                Education
              </CardTitle>
              <CardDescription>
                Add your educational background and qualifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {education.map((edu, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Education {index + 1}</h3>
                    {education.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(index)}
                      >
                        <TrashIcon className="size-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>School *</Label>
                      <Input
                        value={edu.school}
                        onChange={(e) =>
                          updateEducation(index, "school", e.target.value)
                        }
                        placeholder="Harvard University"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Degree *</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) =>
                          updateEducation(index, "degree", e.target.value)
                        }
                        placeholder="Bachelor's in Computer Science"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        value={edu.location}
                        onChange={(e) =>
                          updateEducation(index, "location", e.target.value)
                        }
                        placeholder="Cambridge, MA"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Graduation Date</Label>
                      <Input
                        type="month"
                        value={edu.graduationDate}
                        onChange={(e) =>
                          updateEducation(
                            index,
                            "graduationDate",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>GPA (Optional)</Label>
                    <Input
                      value={edu.gpa || ""}
                      onChange={(e) =>
                        updateEducation(index, "gpa", e.target.value)
                      }
                      placeholder="3.8/4.0"
                    />
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addEducation}
                className="w-full"
              >
                <PlusIcon className="size-4 mr-2" />
                Add Another Education
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Projects & Skills */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CodeIcon className="size-5" />
                  Projects
                </CardTitle>
                <CardDescription>
                  Showcase your personal projects, open source contributions, or
                  side projects.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {projects.map((proj, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Project {index + 1}</h3>
                      {projects.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProject(index)}
                        >
                          <TrashIcon className="size-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Project Name *</Label>
                        <Input
                          value={proj.name}
                          onChange={(e) =>
                            updateProject(index, "name", e.target.value)
                          }
                          placeholder="My Awesome Project"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Technologies</Label>
                        <Input
                          value={proj.technologies}
                          onChange={(e) =>
                            updateProject(index, "technologies", e.target.value)
                          }
                          placeholder="React, Node.js, MongoDB"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Project Link</Label>
                        <Input
                          value={proj.link || ""}
                          onChange={(e) =>
                            updateProject(index, "link", e.target.value)
                          }
                          placeholder="https://github.com/username/project"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={proj.description}
                        onChange={(e) =>
                          updateProject(index, "description", e.target.value)
                        }
                        placeholder="Describe what this project does and your role in building it..."
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addProject}
                  className="w-full"
                >
                  <PlusIcon className="size-4 mr-2" />
                  Add Another Project
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
                <CardDescription>
                  Add your technical skills, programming languages, frameworks,
                  and tools.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill (e.g., JavaScript, React, Python)"
                    onKeyPress={(e) => e.key === "Enter" && addSkill()}
                  />
                  <Button onClick={addSkill}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-muted-foreground"
            >
              Skip
            </Button>
          </div>
          {currentStep < 4 ? (
            <Button
              onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
              disabled={!isStepValid()}
            >
              Next
              <ArrowRightIcon className="size-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              className="bg-primary"
              disabled={!isStepValid()}
            >
              Complete Setup
              <ArrowRightIcon className="size-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
