import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin, Briefcase, Calendar, GraduationCap, Award } from "lucide-react";

interface CVData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  title: string;
  summary: string;
  company: string;
  position: string;
  duration: string;
  description: string;
  education: string;
  skills: string;
  photo: string;
}

interface CVPreviewProps {
  data: CVData;
  template: string;
}

export const CVPreview = ({ data, template }: CVPreviewProps) => {
  const renderSimpleTemplate = () => (
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
        <p className="text-foreground">{data.summary}</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 mb-3 flex items-center gap-2">
          <GraduationCap className="h-6 w-6" />
          HỌC VẤN
        </h2>
        <p className="text-foreground">{data.education}</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 mb-3 flex items-center gap-2">
          <Briefcase className="h-6 w-6" />
          KINH NGHIỆM LÀM VIỆC
        </h2>
        <div className="mb-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
                <span className="text-primary">●</span>
                {data.company}
              </h3>
              <p className="font-semibold text-foreground ml-4">{data.position}</p>
            </div>
            <span className="text-muted-foreground flex items-center gap-1 text-sm">
              <Calendar className="h-4 w-4" />
              {data.duration}
            </span>
          </div>
          <p className="text-foreground ml-4">{data.description}</p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 mb-3 flex items-center gap-2">
          <Award className="h-6 w-6" />
          KỸ NĂNG
        </h2>
        <p className="text-foreground">{data.skills}</p>
      </div>
    </div>
  );

  const renderModernTemplate = () => (
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
        <div>
          <h3 className="font-bold text-foreground mb-3 border-b border-primary pb-1 flex items-center gap-2">
            <Award className="h-4 w-4" />
            KỸ NĂNG
          </h3>
          <p className="text-sm text-foreground">{data.skills}</p>
        </div>
      </div>

      <div className="col-span-2 p-8 space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-foreground">{data.fullName}</h1>
          <p className="text-xl text-primary font-semibold">{data.title}</p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-foreground mb-2 border-l-4 border-primary pl-2">MỤC TIÊU NGHỀ NGHIỆP</h2>
          <p className="text-foreground">{data.summary}</p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-foreground mb-2 border-l-4 border-primary pl-2 flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            HỌC VẤN
          </h2>
          <p className="text-foreground">{data.education}</p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-foreground mb-3 border-l-4 border-primary pl-2 flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            KINH NGHIỆM LÀM VIỆC
          </h2>
          <div className="space-y-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-foreground text-lg">{data.position}</h3>
              <span className="text-muted-foreground text-sm flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {data.duration}
              </span>
            </div>
            <p className="text-primary font-semibold mb-2 flex items-center gap-2">
              <span className="text-primary">●</span>
              {data.company}
            </p>
            <p className="text-foreground ml-4">{data.description}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfessionalTemplate = () => (
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
            <p className="text-foreground">{data.summary}</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary uppercase mb-3 flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Kinh nghiệm làm việc
            </h2>
            <div className="border-l-2 border-primary pl-4 space-y-2">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-foreground text-lg">{data.position}</h3>
                <span className="text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {data.duration}
                </span>
              </div>
              <p className="font-semibold text-primary mb-2 flex items-center gap-2">
                <span className="text-primary">●</span>
                Công ty: {data.company}
              </p>
              <p className="text-foreground">{data.description}</p>
            </div>
          </div>
        </div>

        <div className="col-span-1 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-primary uppercase mb-3 flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Học vấn
            </h2>
            <p className="text-sm text-foreground">{data.education}</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-primary uppercase mb-3 flex items-center gap-2">
              <Award className="h-5 w-5" />
              Kỹ năng
            </h2>
            <p className="text-sm text-foreground">{data.skills}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCreativeTemplate = () => (
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
            <p className="text-foreground">{data.summary}</p>
          </Card>

          <Card className="p-4 border-l-4 border-accent">
            <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-accent" />
              Kinh nghiệm làm việc
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
                    <span className="text-primary">●</span>
                    Vị trí: {data.position}
                  </h3>
                  <p className="text-primary font-semibold ml-4">Công ty: {data.company}</p>
                </div>
                <span className="text-muted-foreground text-sm bg-muted px-3 py-1 rounded-full flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {data.duration}
                </span>
              </div>
              <p className="text-foreground ml-4">{data.description}</p>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4 bg-primary/5">
            <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Học vấn
            </h2>
            <p className="text-sm text-foreground">{data.education}</p>
          </Card>

          <Card className="p-4 bg-accent/5">
            <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
              <Award className="h-5 w-5 text-accent" />
              Kỹ năng
            </h2>
            <p className="text-sm text-foreground">{data.skills}</p>
          </Card>
        </div>
      </div>
    </div>
  );

  const templates = {
    simple: renderSimpleTemplate,
    modern: renderModernTemplate,
    professional: renderProfessionalTemplate,
    creative: renderCreativeTemplate,
  };

  return (
    <div className="w-full">
      {templates[template as keyof typeof templates]?.()}
    </div>
  );
};
