import { Mail, Phone, MapPin, Briefcase, Calendar, GraduationCap, Award } from "lucide-react";

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

interface SimpleTemplateProps {
  data: CVData;
  skills?: CVSkill[];
  workExperiences?: CVWorkExperience[];
  educations?: CVEducation[];
}

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' });
};

export const SimpleTemplate = ({ data, skills = [], workExperiences = [], educations = [] }: SimpleTemplateProps) => {
  return (
    <div className="bg-background p-8 space-y-6" id="cv-preview">
      <div className="text-center border-b-2 border-primary pb-4">
        {data.photo && (
          <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden border-4 border-primary">
            <img src={data.photo} alt={data.fullName} className="w-full h-full object-cover" />
          </div>
        )}
        <h1 className="text-4xl font-bold text-foreground mb-2">{data.fullName}</h1>
        <p className="text-xl text-muted-foreground mb-3">{data.title}</p>
        <div className="flex justify-center gap-6 text-sm text-muted-foreground flex-wrap">
          {data.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{data.phone}</span>
            </div>
          )}
          {data.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{data.email}</span>
            </div>
          )}
          {data.address && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{data.address}</span>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 mb-3">MỤC TIÊU NGHỀ NGHIỆP</h2>
        <p className="text-foreground whitespace-pre-wrap">{data.summary}</p>
      </div>

      {educations.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 mb-3 flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            HỌC VẤN
          </h2>
          <div className="space-y-4">
            {educations.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
                      <span className="text-primary">●</span>
                      {edu.schoolName}
                    </h3>
                    <p className="text-foreground ml-4">
                      {edu.degree} {edu.major && `- ${edu.major}`}
                      {edu.grade && ` (GPA: ${edu.grade})`}
                    </p>
                  </div>
                  {(edu.startDate || edu.endDate) && (
                    <span className="text-muted-foreground flex items-center gap-1 text-sm">
                      <Calendar className="h-4 w-4" />
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </span>
                  )}
                </div>
                {edu.description && <p className="text-foreground ml-4">{edu.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {workExperiences.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 mb-3 flex items-center gap-2">
            <Briefcase className="h-6 w-6" />
            KINH NGHIỆM LÀM VIỆC
          </h2>
          <div className="space-y-4">
            {workExperiences.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
                      <span className="text-primary">●</span>
                      {exp.companyName}
                    </h3>
                    <p className="font-semibold text-foreground ml-4">{exp.position}</p>
                  </div>
                  {(exp.startDate || exp.endDate) && (
                    <span className="text-muted-foreground flex items-center gap-1 text-sm">
                      <Calendar className="h-4 w-4" />
                      {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                    </span>
                  )}
                </div>
                {exp.description && <p className="text-foreground ml-4 whitespace-pre-wrap">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 mb-3 flex items-center gap-2">
            <Award className="h-6 w-6" />
            KỸ NĂNG
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {skills.map((skill, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-foreground">{skill.skillName}</span>
                <span className="text-sm text-muted-foreground">{skill.proficiencyLevel}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
