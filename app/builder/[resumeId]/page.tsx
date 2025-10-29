"use client";
import { PDFTemplate } from "@/components/resume/pdf-template";
import { ResumeTemplate } from "@/components/resume/template";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Education, Experience, Project, ResumeData } from "@/lib/types/resume";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Label } from "@radix-ui/react-label";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import {
  FileTextIcon,
  DownloadIcon,
  ArrowLeftIcon,
  EditIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  SparklesIcon,
  CheckIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const defaultResumeData: ResumeData = {
  _id: "temp",
  title: "temp",
  personalInfo: {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "555-123-4567",
    location: "San Francisco, CA",
    linkedin: "https://linkedin.com/in/janedoe",
    github: "https://github.com/janedoe",
  },
  summary:
    "Full-stack developer with 5+ years of experience building scalable web applications.",
  experience: [
    {
      title: "Software Engineer",
      company: "TechCorp",
      location: "Remote",
      startDate: "Jan 2020",
      endDate: "Present",
      description:
        "Built and maintained full-stack applications using React, Node.js, and AWS.",
    },
  ],
  education: [
    {
      degree: "B.S. Computer Science",
      school: "State University",
      location: "CA",
      graduationDate: "2019",
      gpa: "3.8",
    },
  ],
  skills: ["JavaScript", "React", "Node.js", "TypeScript", "AWS"],
  projects: [
    {
      name: "Portfolio Website",
      description: "Personal portfolio showcasing projects and blog posts.",
      technologies: "Next.js, TailwindCSS, Vercel",
      link: "https://janedoe.dev",
    },
  ],
};

export default function ResumeBuilderPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { resumeId } = useParams<{ resumeId: string }>();

  const updateResume = useMutation(api.resumes.updateResume);
  const generateSuggestion = useMutation(api.suggestions.generateSuggestion);
  const messageResult = useQuery(api.resumes.getResume, {
    resumeId: resumeId as Id<"resumes">,
  });
  const suggestionResult = useQuery(api.suggestions.getSuggestion, {
    resumeId: resumeId as Id<"resumes">,
  });
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [originalData, setOriginalData] = useState<ResumeData | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [jobInput, setJobInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiProcessingStarted, setAiProcessingStarted] = useState(false);

  // Save function
  const saveResume = useCallback(
    async (data: ResumeData) => {
      // Don't save if data hasn't loaded from the server yet
      if (!isDataLoaded || !originalData) return;

      // Don't save if the data is still the default data
      if (JSON.stringify(data) === JSON.stringify(defaultResumeData)) return;

      // Don't save if _id is still "temp"
      if (data._id === "temp") return;

      // Don't save if data hasn't actually changed from the original
      if (JSON.stringify(data) === JSON.stringify(originalData)) return;

      console.log("Saving resume:", data);

      try {
        await updateResume({
          resumeId: resumeId as Id<"resumes">,
          data: {
            title: data.title,
            summary: data.summary,
            skills: data.skills,
            personalInfo: data.personalInfo,
            projects: data.projects,
            experience: data.experience,
            education: data.education.map((edu) => ({
              ...edu,
              gpa: edu.gpa ?? "",
            })),
          },
        });

        // Update original data after successful save
        setOriginalData(data);
      } catch (error) {
        console.error("Failed to save resume:", error);
      }
    },
    [isDataLoaded, originalData, updateResume, resumeId]
  );

  // Debounced save function
  const debouncedSave = useDebouncedCallback(saveResume, 1000);

  useEffect(() => {
    if (messageResult && messageResult.ok) {
      const serverData = messageResult.value;
      setResumeData(serverData);
      setOriginalData(serverData);
      setIsDataLoaded(true);
    }
  }, [messageResult]);

  // Auto-save when resumeData changes (but only if it's different from original)
  useEffect(() => {
    if (isDataLoaded && originalData) {
      debouncedSave(resumeData);
    }
  }, [resumeData, debouncedSave, isDataLoaded, originalData]);

  // Stop loading when suggestions appear
  useEffect(() => {
    if (
      aiProcessingStarted &&
      suggestionResult &&
      suggestionResult.ok &&
      suggestionResult.value.recommendations.length > 0
    ) {
      setIsAnalyzing(false);
      setAiProcessingStarted(false);
    }
  }, [aiProcessingStarted, suggestionResult]);

  // Timeout to stop loading after 60 seconds in case something goes wrong
  useEffect(() => {
    if (aiProcessingStarted) {
      const timeout = setTimeout(() => {
        setIsAnalyzing(false);
        setAiProcessingStarted(false);
        console.warn("AI processing timed out after 60 seconds");
      }, 60000);

      return () => clearTimeout(timeout);
    }
  }, [aiProcessingStarted]);

  const addExperience = () => {
    const newExp = {
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    setResumeData((prev) => ({
      ...prev,
      experience: [...prev.experience, newExp],
    }));
  };

  const removeExperience = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const updateExperience = (
    index: number,
    field: keyof Experience,
    value: string
  ) => {
    setResumeData((prev) => {
      const updated = [...prev.experience];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, experience: updated };
    });
  };

  // --- EDUCATION ---
  const addEducation = () => {
    const newEdu = {
      degree: "",
      school: "",
      location: "",
      graduationDate: "",
      gpa: "",
    };
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, newEdu],
    }));
  };

  const removeEducation = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const updateEducation = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    setResumeData((prev) => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  };

  // --- PROJECTS ---
  const addProject = () => {
    const newProject = {
      name: "",
      description: "",
      technologies: "",
      link: "",
    };
    setResumeData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
  };

  const removeProject = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const updateProject = (
    index: number,
    field: keyof Project,
    value: string
  ) => {
    setResumeData((prev) => {
      const updated = [...prev.projects];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, projects: updated };
    });
  };

  const addSkill = (skill: string) => {
    if (skill.trim() && !resumeData.skills.includes(skill.trim())) {
      setResumeData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill.trim()],
      }));
    }
  };

  const removeSkill = (skill: string) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleAiOptimization = async () => {
    if (!jobInput.trim()) return;

    setIsAnalyzing(true);
    setAiProcessingStarted(true);
    try {
      await generateSuggestion({
        resumeId: resumeId as Id<"resumes">,
        jobDesc: jobInput.trim(),
      });
      // Don't set isAnalyzing to false here - let it continue until suggestions appear
    } catch (error) {
      console.error("Failed to generate suggestions:", error);
      setIsAnalyzing(false);
      setAiProcessingStarted(false);
    }
  };

  if (messageResult === undefined) {
    return <div>Loading...</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
              <FileTextIcon className="size-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Resumify AI
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href={"/"}>
                <ArrowLeftIcon className="size-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <div className="grid lg:grid-cols-2 gap-6 p-4">
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <SparklesIcon className="size-4 text-primary" />
                AI Resume Optimization
              </CardTitle>
              <CardDescription className="text-sm">
                Enter a job description to get AI-powered optimization
                suggestions for your resume
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="job-description" className="text-sm">
                    Job Description
                  </Label>
                  <Textarea
                    id="job-description"
                    placeholder="Paste the complete job description here..."
                    value={jobInput}
                    onChange={(e) => setJobInput(e.target.value)}
                    rows={4}
                    className="resize-none text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={handleAiOptimization}
                  disabled={!jobInput.trim() || isAnalyzing}
                  className="h-9"
                >
                  <SparklesIcon className="size-4 mr-2" />
                  {isAnalyzing
                    ? aiProcessingStarted
                      ? "Generating AI suggestions..."
                      : "Analyzing..."
                    : "Analyze & Optimize Resume"}
                </Button>
                {suggestionResult &&
                  suggestionResult.ok &&
                  suggestionResult.value.recommendations.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {suggestionResult.value.recommendations.length}{" "}
                      suggestions pending
                    </Badge>
                  )}
              </div>
            </CardContent>
          </Card>

          {suggestionResult &&
            suggestionResult.ok &&
            suggestionResult.value.recommendations.length > 0 && (
              <Card className="mb-4 border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <SparklesIcon className="size-4 text-primary" />
                    AI Optimization Suggestions
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Review and apply these improvements to better match the job
                    requirements
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  {suggestionResult.value.recommendations.map(
                    (suggestion, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {suggestion.type}
                          </Badge>
                          <div className="flex gap-1.5">
                            <Button
                              size="sm"
                              className="h-7 px-2 text-xs" /*onClick={() => acceptSuggestion(index)}*/
                            >
                              <CheckIcon className="size-3 mr-1" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-xs bg-transparent"
                              // onClick={() => rejectSuggestion(index)}
                            >
                              <XIcon className="size-3 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Current:
                            </Label>
                            <p className="text-xs bg-muted/50 p-2 rounded">
                              {suggestion.current}
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Suggested:
                            </Label>
                            <p className="text-xs bg-primary/5 p-2 rounded border border-primary/20">
                              {suggestion.suggested}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </CardContent>
              </Card>
            )}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <EditIcon className="size-5" />
                Resume Editor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Label htmlFor="resume-title">Resume Name</Label>
                <Input
                  id="resume-title"
                  value={resumeData.title}
                  onChange={(e) =>
                    setResumeData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Enter resume name"
                />
              </div>
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={resumeData.personalInfo.name}
                        onChange={(e) =>
                          setResumeData((prev) => ({
                            ...prev,
                            personalInfo: {
                              ...prev.personalInfo,
                              name: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={resumeData.personalInfo.email}
                        onChange={(e) =>
                          setResumeData((prev) => ({
                            ...prev,
                            personalInfo: {
                              ...prev.personalInfo,
                              email: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={resumeData.personalInfo.phone}
                        onChange={(e) =>
                          setResumeData((prev) => ({
                            ...prev,
                            personalInfo: {
                              ...prev.personalInfo,
                              phone: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={resumeData.personalInfo.location}
                        onChange={(e) =>
                          setResumeData((prev) => ({
                            ...prev,
                            personalInfo: {
                              ...prev.personalInfo,
                              location: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn URL</Label>
                      <Input
                        id="linkedin"
                        value={resumeData.personalInfo.linkedin}
                        onChange={(e) =>
                          setResumeData((prev) => ({
                            ...prev,
                            personalInfo: {
                              ...prev.personalInfo,
                              linkedin: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="github">GitHub URL</Label>
                      <Input
                        id="github"
                        value={resumeData.personalInfo.github}
                        onChange={(e) =>
                          setResumeData((prev) => ({
                            ...prev,
                            personalInfo: {
                              ...prev.personalInfo,
                              github: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="summary" className="space-y-4">
                  <div>
                    <Label htmlFor="summary">Professional Summary</Label>
                    <Textarea
                      id="summary"
                      placeholder="Write a compelling summary of your professional background..."
                      value={resumeData.summary}
                      onChange={(e) =>
                        setResumeData((prev) => ({
                          ...prev,
                          summary: e.target.value,
                        }))
                      }
                      rows={6}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="experience" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Work Experience</h3>
                    <Button onClick={addExperience} size="sm">
                      <PlusIcon className="size-4 mr-2" />
                      Add Experience
                    </Button>
                  </div>
                  {resumeData.experience.map((exp, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Experience Entry</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExperience(index)}
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Job Title</Label>
                            <Input
                              value={exp.title}
                              onChange={(e) =>
                                updateExperience(index, "title", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <Label>Company</Label>
                            <Input
                              value={exp.company}
                              onChange={(e) =>
                                updateExperience(
                                  index,
                                  "company",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label>Location</Label>
                            <Input
                              value={exp.location}
                              onChange={(e) =>
                                updateExperience(
                                  index,
                                  "location",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label>Start Date</Label>
                            <Input
                              value={exp.startDate}
                              onChange={(e) =>
                                updateExperience(
                                  index,
                                  "startDate",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="col-span-2">
                            <Label>End Date</Label>
                            <Input
                              value={exp.endDate}
                              onChange={(e) =>
                                updateExperience(
                                  index,
                                  "endDate",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={exp.description}
                            onChange={(e) =>
                              updateExperience(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            rows={3}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="education" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Education</h3>
                    <Button onClick={addEducation} size="sm">
                      <PlusIcon className="size-4 mr-2" />
                      Add Education
                    </Button>
                  </div>
                  {resumeData.education.map((edu, idx) => (
                    <Card key={idx}>
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Education Entry</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEducation(idx)}
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Degree</Label>
                            <Input
                              value={edu.degree}
                              onChange={(e) =>
                                updateEducation(idx, "degree", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <Label>School</Label>
                            <Input
                              value={edu.school}
                              onChange={(e) =>
                                updateEducation(idx, "school", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <Label>Location</Label>
                            <Input
                              value={edu.location}
                              onChange={(e) =>
                                updateEducation(idx, "location", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <Label>Graduation Date</Label>
                            <Input
                              value={edu.graduationDate}
                              onChange={(e) =>
                                updateEducation(
                                  idx,
                                  "graduationDate",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label>GPA (Optional)</Label>
                            <Input
                              value={edu.gpa}
                              onChange={(e) =>
                                updateEducation(idx, "gpa", e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="skills" className="space-y-4">
                  <div>
                    <Label htmlFor="skill-input">Add Skills</Label>
                    <div className="flex gap-2">
                      <Input
                        id="skill-input"
                        placeholder="Type a skill and press Enter"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            addSkill(e.currentTarget.value);
                            e.currentTarget.value = "";
                          }
                        }}
                      />
                      <Button
                        onClick={() => {
                          const input = document.getElementById(
                            "skill-input"
                          ) as HTMLInputElement;
                          addSkill(input.value);
                          input.value = "";
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="cursor-pointer"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-2 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="projects" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Projects</h3>
                    <Button onClick={addProject} size="sm">
                      <PlusIcon className="size-4 mr-2" />
                      Add Project
                    </Button>
                  </div>
                  {resumeData.projects.map((project, idx) => (
                    <Card key={idx}>
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Project Entry</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProject(idx)}
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Project Name</Label>
                            <Input
                              value={project.name}
                              onChange={(e) =>
                                updateProject(idx, "name", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <Label>Project Link (Optional)</Label>
                            <Input
                              value={project.link}
                              onChange={(e) =>
                                updateProject(idx, "link", e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Technologies Used</Label>
                          <Input
                            value={project.technologies}
                            onChange={(e) =>
                              updateProject(idx, "technologies", e.target.value)
                            }
                            placeholder="React, Node.js, MongoDB, etc."
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={project.description}
                            onChange={(e) =>
                              updateProject(idx, "description", e.target.value)
                            }
                            rows={3}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardHeader className="flex justify-between">
              <CardTitle className="flex items-center gap-2">
                <EyeIcon className="size-5" />
                Resume Preview
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={`/api/exporter/resume/${resumeData._id}`}
                  target="_blank"
                >
                  <DownloadIcon className="size-4 mr-2" />
                  Export PDF
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="bg-white text-black p-8 rounded-lg border min-h-[800px] font-mono text-sm max-h-[800px] overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans">
                  <ResumeTemplate resume={resumeData} />
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
