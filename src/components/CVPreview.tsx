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
  // Normalize template name to lowercase and remove special characters
  const normalizedTemplate = template.toLowerCase().replace(/[-_\s]/g, '');
  
  // Map common template name variations to valid template names
  const templateMap: Record<string, string> = {
    'simple': 'simple',
    'modern': 'modern',
    'modernprofessional01': 'modern',
    'modernprofessional': 'modern',
    'professional': 'professional',
    'creative': 'creative',
  };

  // Get the template or fallback to modern
  const validTemplate = templateMap[normalizedTemplate] || 'modern';

  // Render the appropriate template
  if (validTemplate === 'simple') {
    return (
      <div className="w-full">
        <SimpleTemplate data={data} skills={skills} workExperiences={workExperiences} educations={educations} />
      </div>
    );
  }
  
  if (validTemplate === 'professional') {
    return (
      <div className="w-full">
        <ProfessionalTemplate data={data} skills={skills} workExperiences={workExperiences} educations={educations} />
      </div>
    );
  }
  
  if (validTemplate === 'creative') {
    return (
      <div className="w-full">
        <CreativeTemplate data={data} skills={skills} workExperiences={workExperiences} educations={educations} />
      </div>
    );
  }

  // Default to modern template
  return (
    <div className="w-full">
      <ModernTemplate data={data} skills={skills} workExperiences={workExperiences} educations={educations} />
    </div>
  );
};
