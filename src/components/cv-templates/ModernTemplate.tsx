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

interface ModernTemplateProps {
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

export const ModernTemplate = ({ data, skills = [], workExperiences = [], educations = [] }: ModernTemplateProps) => {
  return (
    <div className="bg-background grid grid-cols-3 gap-0" id="cv-preview">
      <div className="col-span-1 bg-primary/10 p-6 space-y-6">
        <div className="w-32 h-32 rounded-full bg-muted mx-auto mb-4 overflow-hidden border-4 border-primary">
          {data.photo ? (
            <img src={data.photo} alt={data.fullName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-muted"></div>
          )}
        </div>
        <div>
          <h3 className="font-bold text-foreground mb-3 border-b border-primary pb-1 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            LIÊN HỆ
          </h3>
          <div className="space-y-2 text-sm text-foreground">
            {data.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <p>{data.phone}</p>
              </div>
            )}
            {data.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <p className="break-all">{data.email}</p>
              </div>
            )}
            {data.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <p>{data.address}</p>
              </div>
            )}
          </div>
        </div>
        {skills.length > 0 && (
          <div>
            <h3 className="font-bold text-foreground mb-3 border-b border-primary pb-1 flex items-center gap-2">
              <Award className="h-4 w-4" />
              KỸ NĂNG
            </h3>
            <div className="space-y-2">
              {skills.map((skill, index) => (
                <div key={index} className="text-sm">
                  <p className="font-semibold text-foreground">{skill.skillName}</p>
                  <p className="text-xs text-muted-foreground">{skill.proficiencyLevel}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="col-span-2 p-8 space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-foreground">{data.fullName}</h1>
          <p className="text-xl text-primary font-semibold">{data.title}</p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-foreground mb-2 border-l-4 border-primary pl-2">MỤC TIÊU NGHỀ NGHIỆP</h2>
          <p className="text-foreground whitespace-pre-wrap">{data.summary}</p>
        </div>

        {educations.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-2 border-l-4 border-primary pl-2 flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              HỌC VẤN
            </h2>
            <div className="space-y-3">
              {educations.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-foreground">{edu.schoolName}</h3>
                    {(edu.startDate || edu.endDate) && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground">
                    {edu.degree} {edu.major && `- ${edu.major}`}
                    {edu.grade && ` (GPA: ${edu.grade})`}
                  </p>
                  {edu.description && <p className="text-sm text-muted-foreground mt-1">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {workExperiences.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-3 border-l-4 border-primary pl-2 flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              KINH NGHIỆM LÀM VIỆC
            </h2>
            <div className="space-y-4">
              {workExperiences.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-foreground text-lg">{exp.position}</h3>
                    {(exp.startDate || exp.endDate) && (
                      <span className="text-muted-foreground text-sm flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                      </span>
                    )}
                  </div>
                  <p className="text-primary font-semibold mb-2 flex items-center gap-2">
                    <span className="text-primary">●</span>
                    {exp.companyName}
                  </p>
                  {exp.description && <p className="text-foreground ml-4 whitespace-pre-wrap">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
