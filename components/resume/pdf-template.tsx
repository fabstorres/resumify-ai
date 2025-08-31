// components/resume/pdf.tsx
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { ResumeData } from "@/lib/types/resume";

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: "Helvetica" },
  section: { marginBottom: 10 },
  heading: { fontSize: 16, marginBottom: 4, fontWeight: "bold" },
});

export function PDFTemplate({ resume }: { resume: ResumeData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          {resume.personalInfo.name}
        </Text>
        <Text>
          {resume.personalInfo.email} • {resume.personalInfo.phone} •{" "}
          {resume.personalInfo.location}
        </Text>

        {resume.summary && (
          <View style={styles.section}>
            <Text style={styles.heading}>Summary</Text>
            <Text>{resume.summary}</Text>
          </View>
        )}

        {resume.experience.map((exp) => (
          <View key={exp.id} style={styles.section}>
            <Text style={{ fontWeight: "bold" }}>{exp.title}</Text>
            <Text>
              {exp.company} • {exp.location} • {exp.startDate} – {exp.endDate}
            </Text>
            <Text>{exp.description}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );
}
