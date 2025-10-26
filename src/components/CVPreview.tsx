import { Card } from "@/components/ui/card";

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
}

interface CVPreviewProps {
  data: CVData;
  template: string;
}

export const CVPreview = ({ data, template }: CVPreviewProps) => {
  const renderSimpleTemplate = () => (
    <div className="bg-background p-8 space-y-6" id="cv-preview">
      <div className="text-center border-b-2 border-primary pb-4">
        <h1 className="text-4xl font-bold text-foreground mb-2">{data.fullName}</h1>
        <p className="text-xl text-muted-foreground mb-2">{data.title}</p>
        <div className="flex justify-center gap-4 text-sm text-muted-foreground">
          <span>{data.phone}</span>
          <span>{data.email}</span>
          <span>{data.address}</span>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 mb-3">MỤC TIÊU NGHỀ NGHIỆP</h2>
        <p className="text-foreground">{data.summary}</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 mb-3">HỌC VẤN</h2>
        <p className="text-foreground">{data.education}</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 mb-3">KINH NGHIỆM LÀM VIỆC</h2>
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <h3 className="font-bold text-foreground">{data.company}</h3>
            <span className="text-muted-foreground">{data.duration}</span>
          </div>
          <p className="font-semibold text-foreground mb-2">{data.position}</p>
          <p className="text-foreground">{data.description}</p>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2 mb-3">KỸ NĂNG</h2>
        <p className="text-foreground">{data.skills}</p>
      </div>
    </div>
  );

  const renderModernTemplate = () => (
    <div className="bg-background grid grid-cols-3 gap-0" id="cv-preview">
      <div className="col-span-1 bg-primary/10 p-6 space-y-6">
        <div className="w-32 h-32 rounded-full bg-muted mx-auto mb-4"></div>
        <div>
          <h3 className="font-bold text-foreground mb-2 border-b border-primary pb-1">LIÊN HỆ</h3>
          <div className="space-y-1 text-sm text-foreground">
            <p>{data.phone}</p>
            <p>{data.email}</p>
            <p>{data.address}</p>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-foreground mb-2 border-b border-primary pb-1">KỸ NĂNG</h3>
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
          <h2 className="text-xl font-bold text-foreground mb-2 border-l-4 border-primary pl-2">HỌC VẤN</h2>
          <p className="text-foreground">{data.education}</p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-foreground mb-2 border-l-4 border-primary pl-2">KINH NGHIỆM LÀM VIỆC</h2>
          <div>
            <div className="flex justify-between mb-1">
              <h3 className="font-bold text-foreground">{data.position}</h3>
              <span className="text-muted-foreground text-sm">{data.duration}</span>
            </div>
            <p className="text-primary font-semibold mb-2">{data.company}</p>
            <p className="text-foreground">{data.description}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfessionalTemplate = () => (
    <div className="bg-background p-8 space-y-6" id="cv-preview">
      <div className="grid grid-cols-4 gap-6 border-b-4 border-primary pb-6">
        <div className="col-span-1">
          <div className="w-full aspect-square bg-muted rounded"></div>
        </div>
        <div className="col-span-3">
          <h1 className="text-4xl font-bold text-primary mb-2">{data.fullName}</h1>
          <p className="text-2xl text-foreground mb-4">{data.title}</p>
          <div className="grid grid-cols-3 gap-2 text-sm text-foreground">
            <div>
              <p className="font-semibold">Email:</p>
              <p>{data.email}</p>
            </div>
            <div>
              <p className="font-semibold">Điện thoại:</p>
              <p>{data.phone}</p>
            </div>
            <div>
              <p className="font-semibold">Địa chỉ:</p>
              <p>{data.address}</p>
            </div>
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
            <h2 className="text-xl font-bold text-primary uppercase mb-3">Kinh nghiệm làm việc</h2>
            <div className="border-l-2 border-primary pl-4">
              <div className="flex justify-between mb-1">
                <h3 className="font-bold text-foreground">{data.position}</h3>
                <span className="text-muted-foreground">{data.duration}</span>
              </div>
              <p className="font-semibold text-primary mb-2">{data.company}</p>
              <p className="text-foreground">{data.description}</p>
            </div>
          </div>
        </div>

        <div className="col-span-1 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-primary uppercase mb-3">Học vấn</h2>
            <p className="text-sm text-foreground">{data.education}</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-primary uppercase mb-3">Kỹ năng</h2>
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
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">{data.fullName}</h1>
          <p className="text-2xl text-foreground font-semibold mb-4">{data.title}</p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>📞 {data.phone}</span>
            <span>✉️ {data.email}</span>
            <span>📍 {data.address}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <Card className="p-4 border-l-4 border-primary">
            <h2 className="text-xl font-bold text-foreground mb-2">💼 Mục tiêu nghề nghiệp</h2>
            <p className="text-foreground">{data.summary}</p>
          </Card>

          <Card className="p-4 border-l-4 border-accent">
            <h2 className="text-xl font-bold text-foreground mb-3">🏢 Kinh nghiệm làm việc</h2>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-foreground text-lg">{data.position}</h3>
                <p className="text-primary font-semibold">{data.company}</p>
              </div>
              <span className="text-muted-foreground text-sm bg-muted px-3 py-1 rounded-full">{data.duration}</span>
            </div>
            <p className="text-foreground mt-2">{data.description}</p>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-4 bg-primary/5">
            <h2 className="text-lg font-bold text-foreground mb-2">🎓 Học vấn</h2>
            <p className="text-sm text-foreground">{data.education}</p>
          </Card>

          <Card className="p-4 bg-accent/5">
            <h2 className="text-lg font-bold text-foreground mb-2">⚡ Kỹ năng</h2>
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
