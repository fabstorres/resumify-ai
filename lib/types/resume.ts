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
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type Education = {
  degree: string;
  school: string;
  location: string;
  graduationDate: string;
  gpa?: string;
};

export type Project = {
  name: string;
  description: string;
  technologies: string;
  link?: string;
};

export type ResumeData = {
  _id: string; // Convex will provide this
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
};
