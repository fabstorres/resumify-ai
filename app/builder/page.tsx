"use client";
import { ResumeTemplate } from "@/components/resume/template";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ResumeData } from "@/lib/types/resume";
import { Label } from "@radix-ui/react-label";
import {
  FileTextIcon,
  DownloadIcon,
  ArrowLeftIcon,
  EditIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const defaultResumeData: ResumeData = {
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
      id: "1",
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
      id: "2",
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
      id: "1",
      name: "Portfolio Website",
      description: "Personal portfolio showcasing projects and blog posts.",
      technologies: "Next.js, TailwindCSS, Vercel",
      link: "https://janedoe.dev",
    },
  ],
};

export default function ResumeBuilderPage() {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
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

  const removeExperience = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };

  const updateExperience = (id: string, field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
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

  const removeEducation = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
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

  const removeProject = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter((proj) => proj.id !== id),
    }));
  };

  const updateProject = (id: string, field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    }));
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

  const generateMarkdownResume = () => {
    const { personalInfo, summary, experience, education, skills, projects } =
      resumeData;

    let markdown = `# ${personalInfo.name}\n\n`;

    const contactInfo = [
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
      personalInfo.linkedin && `[LinkedIn](${personalInfo.linkedin})`,
      personalInfo.github && `[GitHub](${personalInfo.github})`,
    ]
      .filter(Boolean)
      .join(" • ");

    if (contactInfo) {
      markdown += `${contactInfo}\n\n`;
    }

    if (summary) {
      markdown += `## Summary\n\n${summary}\n\n`;
    }

    if (experience.length > 0) {
      markdown += `## Experience\n\n`;
      experience.forEach((exp) => {
        markdown += `### ${exp.title}\n`;
        markdown += `**${exp.company}** • ${exp.location} • ${exp.startDate} - ${exp.endDate}\n\n`;
        if (exp.description) {
          markdown += `${exp.description}\n\n`;
        }
      });
    }

    if (education.length > 0) {
      markdown += `## Education\n\n`;
      education.forEach((edu) => {
        markdown += `### ${edu.degree}\n`;
        markdown += `**${edu.school}** • ${edu.location} • ${edu.graduationDate}`;
        if (edu.gpa) {
          markdown += ` • GPA: ${edu.gpa}`;
        }
        markdown += `\n\n`;
      });
    }

    if (skills.length > 0) {
      markdown += `## Skills\n\n${skills.join(" • ")}\n\n`;
    }

    if (projects.length > 0) {
      markdown += `## Projects\n\n`;
      projects.forEach((proj) => {
        markdown += `### ${proj.name}\n`;
        if (proj.link) {
          markdown += `[View Project](${proj.link})\n\n`;
        }
        if (proj.description) {
          markdown += `${proj.description}\n\n`;
        }
        if (proj.technologies) {
          markdown += `**Technologies:** ${proj.technologies}\n\n`;
        }
      });
    }

    return markdown;
  };
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
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <EditIcon className="size-5" />
                Resume Editor
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                  {resumeData.experience.map((exp) => (
                    <Card key={exp.id}>
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Experience Entry</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExperience(exp.id)}
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
                                updateExperience(
                                  exp.id,
                                  "title",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label>Company</Label>
                            <Input
                              value={exp.company}
                              onChange={(e) =>
                                updateExperience(
                                  exp.id,
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
                                  exp.id,
                                  "location",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label>Start Date</Label>
                              <Input
                                value={exp.startDate}
                                onChange={(e) =>
                                  updateExperience(
                                    exp.id,
                                    "startDate",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Label>End Date</Label>
                              <Input
                                value={exp.endDate}
                                onChange={(e) =>
                                  updateExperience(
                                    exp.id,
                                    "endDate",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={exp.description}
                            onChange={(e) =>
                              updateExperience(
                                exp.id,
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
                  {resumeData.education.map((edu) => (
                    <Card key={edu.id}>
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Education Entry</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeEducation(edu.id)}
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
                                updateEducation(
                                  edu.id,
                                  "degree",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label>School</Label>
                            <Input
                              value={edu.school}
                              onChange={(e) =>
                                updateEducation(
                                  edu.id,
                                  "school",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label>Location</Label>
                            <Input
                              value={edu.location}
                              onChange={(e) =>
                                updateEducation(
                                  edu.id,
                                  "location",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label>Graduation Date</Label>
                            <Input
                              value={edu.graduationDate}
                              onChange={(e) =>
                                updateEducation(
                                  edu.id,
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
                                updateEducation(edu.id, "gpa", e.target.value)
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
                  {resumeData.projects.map((project) => (
                    <Card key={project.id}>
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Project Entry</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProject(project.id)}
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
                                updateProject(
                                  project.id,
                                  "name",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label>Project Link (Optional)</Label>
                            <Input
                              value={project.link}
                              onChange={(e) =>
                                updateProject(
                                  project.id,
                                  "link",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Technologies Used</Label>
                          <Input
                            value={project.technologies}
                            onChange={(e) =>
                              updateProject(
                                project.id,
                                "technologies",
                                e.target.value
                              )
                            }
                            placeholder="React, Node.js, MongoDB, etc."
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={project.description}
                            onChange={(e) =>
                              updateProject(
                                project.id,
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
              <Button variant="outline" size="sm">
                <DownloadIcon className="size-4 mr-2" />
                Export PDF
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
