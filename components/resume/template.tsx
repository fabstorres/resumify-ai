// components/resume/template.tsx
import { ResumeData } from "@/lib/types/resume";

export function ResumeTemplate({ resume }: { resume: ResumeData }) {
  return (
    <div className="p-8 font-sans text-sm text-black bg-white">
      <h1 className="text-2xl font-bold">{resume.personalInfo.name}</h1>
      <p className="text-gray-700">
        {resume.personalInfo.email} • {resume.personalInfo.phone} •{" "}
        {resume.personalInfo.location}
      </p>

      {resume.summary && (
        <section className="mt-6">
          <h2 className="text-lg font-semibold">Summary</h2>
          <p>{resume.summary}</p>
        </section>
      )}

      {resume.experience.length > 0 && (
        <section className="mt-6">
          <h2 className="text-lg font-semibold">Experience</h2>
          {resume.experience.map((exp) => (
            <div key={exp.id} className="mt-2">
              <h3 className="font-medium">{exp.title}</h3>
              <p className="text-gray-600">
                {exp.company} • {exp.location} • {exp.startDate} – {exp.endDate}
              </p>
              <p>{exp.description}</p>
            </div>
          ))}
        </section>
      )}

      {resume.education.length > 0 && (
        <section className="mt-6">
          <h2 className="text-lg font-semibold">Education</h2>
          {resume.education.map((edu) => (
            <div key={edu.id} className="mt-2">
              <h3 className="font-medium">{edu.degree}</h3>
              <p className="text-gray-600">
                {edu.school} • {edu.location} • {edu.graduationDate}
                {edu.gpa && ` • GPA: ${edu.gpa}`}
              </p>
            </div>
          ))}
        </section>
      )}

      {resume.skills.length > 0 && (
        <section className="mt-6">
          <h2 className="text-lg font-semibold">Skills</h2>
          <p>{resume.skills.join(" • ")}</p>
        </section>
      )}

      {resume.projects.length > 0 && (
        <section className="mt-6">
          <h2 className="text-lg font-semibold">Projects</h2>
          {resume.projects.map((proj) => (
            <div key={proj.id} className="mt-2">
              <h3 className="font-medium">{proj.name}</h3>
              {proj.link && (
                <a
                  href={proj.link}
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  {proj.link}
                </a>
              )}
              <p>{proj.description}</p>
              <p className="text-gray-600">
                <strong>Technologies:</strong> {proj.technologies}
              </p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
