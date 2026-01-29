import { Card } from "@/components/ui/card";
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

interface CreativeTemplateProps {
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

export const CreativeTemplate = ({ data, skills = [], workExperiences = [], educations = [] }: CreativeTemplateProps) => {
  return (
    <div className="bg-gradient-to-br from-primary/5 via-background to-accent/5 p-8 space-y-6" id="cv-preview">
      <div className="relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="relative bg-background/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-primary/20">
          <div className="flex items-center gap-6 mb-4">
            {data.photo && (
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary shadow-lg">
                <img src={data.photo} alt={data.fullName} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">{data.fullName}</h1>
              <p className="text-2xl text-foreground font-semibold">{data.title}</p>
            </div>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground flex-wrap">
            {data.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>{data.phone}</span>
              </div>
            )}
            {data.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>{data.email}</span>
              </div>
            )}
            {data.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{data.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <Card className="p-4 border-l-4 border-primary">
            <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Mục tiêu nghề nghiệp
            </h2>
            <p className="text-foreground whitespace-pre-wrap">{data.summary}</p>
          </Card>

          {workExperiences.length > 0 && (
            <Card className="p-4 border-l-4 border-accent">
              <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-accent" />
                Kinh nghiệm làm việc
              </h2>
              <div className="space-y-4">
                {workExperiences.map((exp, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
                          <span className="text-primary">●</span>
                          Vị trí: {exp.position}
                        </h3>
                        <p className="text-primary font-semibold ml-4">Công ty: {exp.companyName}</p>
                      </div>
                      {(exp.startDate || exp.endDate) && (
                        <span className="text-muted-foreground text-sm bg-muted px-3 py-1 rounded-full flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                        </span>
                      )}
                    </div>
                    {exp.description && <p className="text-foreground ml-4 whitespace-pre-wrap">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          {educations.length > 0 && (
            <Card className="p-4 bg-primary/5">
              <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Học vấn
              </h2>
              <div className="space-y-3">
                {educations.map((edu, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-semibold text-foreground">{edu.schoolName}</p>
                    <p className="text-foreground">
                      {edu.degree} {edu.major && `- ${edu.major}`}
                    </p>
                    {edu.grade && <p className="text-muted-foreground text-xs">GPA: {edu.grade}</p>}
                    {(edu.startDate || edu.endDate) && (
                      <p className="text-xs text-muted-foreground">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </p>
                    )}
                    {edu.description && <p className="text-muted-foreground text-xs mt-1">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {skills.length > 0 && (
            <Card className="p-4 bg-accent/5">
              <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                <Award className="h-5 w-5 text-accent" />
                Kỹ năng
              </h2>
              <div className="space-y-2">
                {skills.map((skill, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-semibold text-foreground">{skill.skillName}</p>
                    <p className="text-xs text-muted-foreground">{skill.proficiencyLevel}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
