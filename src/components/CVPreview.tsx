import { SimpleTemplate, ModernTemplate, ProfessionalTemplate, CreativeTemplate } from "@/components/cv-templates";

interface CVSkill {
  skillName: string;
  proficiencyLevel: string;
}

interface CVWorkExperience {
  companyName: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface CVEducation {
  schoolName: string;
  degree: string;
  major: string;
  grade: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface CVData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  title: string;
  summary: string;
  photo: string;
}

interface CVPreviewProps {
  data: CVData;
  template: string;
  skills?: CVSkill[];
  workExperiences?: CVWorkExperience[];
  educations?: CVEducation[];
}

export const CVPreview = ({ data, template, skills = [], workExperiences = [], educations = [] }: CVPreviewProps) => {
  const templates = {
    simple: () => <SimpleTemplate data={data} skills={skills} workExperiences={workExperiences} educations={educations} />,
    modern: () => <ModernTemplate data={data} skills={skills} workExperiences={workExperiences} educations={educations} />,
    professional: () => <ProfessionalTemplate data={data} skills={skills} workExperiences={workExperiences} educations={educations} />,
    creative: () => <CreativeTemplate data={data} skills={skills} workExperiences={workExperiences} educations={educations} />,
  };

  return (
    <div className="w-full">
      {templates[template as keyof typeof templates]?.()}
    </div>
  );
};
