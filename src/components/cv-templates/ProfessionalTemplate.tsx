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

interface ProfessionalTemplateProps {
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

export const ProfessionalTemplate = ({ data, skills = [], workExperiences = [], educations = [] }: ProfessionalTemplateProps) => {
  return (
    <div className="bg-background p-8 space-y-6" id="cv-preview">
      <div className="grid grid-cols-4 gap-6 border-b-4 border-primary pb-6">
        <div className="col-span-1">
          <div className="w-full aspect-square bg-muted rounded overflow-hidden border-2 border-primary">
            {data.photo ? (
              <img src={data.photo} alt={data.fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-muted"></div>
            )}
          </div>
        </div>
        <div className="col-span-3">
          <h1 className="text-4xl font-bold text-primary mb-2">{data.fullName}</h1>
          <p className="text-2xl text-foreground mb-4">{data.title}</p>
          <div className="grid grid-cols-3 gap-4 text-sm text-foreground">
            {data.email && (
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-primary mt-1" />
                <div>
                  <p className="font-semibold">Email:</p>
                  <p className="break-all">{data.email}</p>
                </div>
              </div>
            )}
            {data.phone && (
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-primary mt-1" />
                <div>
                  <p className="font-semibold">Điện thoại:</p>
                  <p>{data.phone}</p>
                </div>
              </div>
            )}
            {data.address && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-1" />
                <div>
                  <p className="font-semibold">Địa chỉ:</p>
                  <p>{data.address}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-primary uppercase mb-3">Mục tiêu nghề nghiệp</h2>
            <p className="text-foreground whitespace-pre-wrap">{data.summary}</p>
          </div>

          {workExperiences.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-primary uppercase mb-3 flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Kinh nghiệm làm việc
              </h2>
              <div className="space-y-4">
                {workExperiences.map((exp, index) => (
                  <div key={index} className="border-l-2 border-primary pl-4 space-y-2">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-foreground text-lg">{exp.position}</h3>
                      {(exp.startDate || exp.endDate) && (
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-primary mb-2 flex items-center gap-2">
                      <span className="text-primary">●</span>
                      Công ty: {exp.companyName}
                    </p>
                    {exp.description && <p className="text-foreground whitespace-pre-wrap">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-1 space-y-6">
          {educations.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-primary uppercase mb-3 flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Học vấn
              </h2>
              <div className="space-y-3">
                {educations.map((edu, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-semibold text-foreground">{edu.schoolName}</p>
                    <p className="text-foreground">
                      {edu.degree} {edu.major && `- ${edu.major}`}
                    </p>
                    {edu.grade && <p className="text-muted-foreground">GPA: {edu.grade}</p>}
                    {(edu.startDate || edu.endDate) && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </p>
                    )}
                    {edu.description && <p className="text-muted-foreground text-xs mt-1">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {skills.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-primary uppercase mb-3 flex items-center gap-2">
                <Award className="h-5 w-5" />
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
