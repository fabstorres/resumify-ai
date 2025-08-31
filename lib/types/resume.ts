// /lib/types/resume.ts
export type PersonalInfo = {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
};

export type Experience = {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type Education = {
  id: string;
  degree: string;
  school: string;
  location: string;
  graduationDate: string;
  gpa?: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link?: string;
};

export type ResumeData = {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
};
