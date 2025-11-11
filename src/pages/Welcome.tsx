import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { type CarouselApi, Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Sparkles, TrendingUp, Target, Zap, Search, MapPin, Moon, Sun, Globe, CheckCircle, List, ChevronRight, UserPlus, FileText, Bot, Briefcase, ArrowRight, type LucideIcon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/locales/translations";
import { useEffect, useState } from "react";

const Welcome = () => {
  const { theme, toggleTheme } = useTheme();
  const { setLanguage: setLang, t: tr, language } = useLanguage();
  // direct access for non-string arrays
  const dict = translations[language as "en" | "vi"];

  type Step = {
    id: string;
    title: string;
    desc: string;
    link: string;
    cta: string;
    icon: LucideIcon;
    color: string; // gradient color token
  };

  const steps: Step[] = [
    {
      id: "signup",
      title: tr("onboarding.signupTitle"),
      desc: tr("onboarding.signupDesc"),
      link: "/signup",
      cta: tr("onboarding.signupCta"),
      icon: UserPlus,
      color: "from-violet-500 to-fuchsia-500",
    },
    {
      id: "cv",
      title: tr("onboarding.cvTitle"),
      desc: tr("onboarding.cvDesc"),
      link: "/cv-builder",
      cta: tr("onboarding.cvCta"),
      icon: FileText,
      color: "from-sky-500 to-cyan-500",
    },
    {
      id: "interview",
      title: tr("onboarding.interviewTitle"),
      desc: tr("onboarding.interviewDesc"),
      link: "/interview-setup",
      cta: tr("onboarding.interviewCta"),
      icon: Bot,
      color: "from-amber-500 to-orange-500",
    },
    {
      id: "jobs",
      title: tr("onboarding.jobsTitle"),
      desc: tr("onboarding.jobsDesc"),
      link: "/jobs",
      cta: tr("onboarding.jobsCta"),
      icon: Briefcase,
      color: "from-emerald-500 to-teal-500",
    },
  ];

  const categories = [
    "Business/Sales",
    "Marketing/PR/Advertising",
    "Customer Service",
    "Human Resources/Admin/Legal",
    "Information Technology",
    "General Labor",
    "Accounting/Finance",
    "Manufacturing/Operations",
    "Education/Training",
    "Healthcare",
  ] as const;

  const companies = [
    { id: "c1", name: "FPT Telecom", city: "Hồ Chí Minh", logo: "/logos/FPT_logo_2010.svg.png", role: "Fullstack Developer", salary: "Thỏa thuận" },
    { id: "c2", name: "Athena Hub", city: "Hồ Chí Minh", logo: "/logos/Athena-Hub.png", role: "Senior Frontend Developer", salary: "30 - 45 triệu" },
    { id: "c3", name: "Persol Career", city: "Hồ Chí Minh", logo: "/logos/Persol-Career.png", role: "Middle Back End Developer (Java)", salary: "750 - 1,900 USD" },
    { id: "c4", name: "ADFLY Việt Nam", city: "Hồ Chí Minh", logo: "/logos/ADFLY.png", role: "Nhân Viên Kinh Doanh / Sales", salary: "Thỏa thuận" },
    { id: "c5", name: "EDUVATOR", city: "Hà Nội & 2 nơi khác", logo: "/logos/EDUVATOR.png", role: "Tư Vấn Khóa Học", salary: "15 - 20 triệu" },
    { id: "c6", name: "TGP Corp", city: "Hồ Chí Minh", logo: "/logos/TGP.png", role: "Nhân Viên Văn Phòng", salary: "7.1 - 8.5 triệu" },
    { id: "c7", name: "Retail FTB", city: "Hồ Chí Minh", logo: "/logos/FTB.png", role: "Bán Hàng Ngành Trang Sức (Nữ)", salary: "12 - 18 triệu" },
    { id: "c8", name: "CMC Corp", city: "Hồ Chí Minh", logo: "/logos/CMC-Corp-logo.png", role: "Kỹ Sư Cơ Khí / Thiết Kế Cơ Khí", salary: "12 - 17 triệu" },
    { id: "c9", name: "Đảo Hải Sản", city: "Hồ Chí Minh", logo: "/logos/DAOHAISAN.png", role: "Kế Toán Trưởng (FMCG / F&B)", salary: "25 - 35 triệu" },
  ] as const;

  const features = [
    { id: "feature-cv", icon: Target, title: tr("welcome.cvBuilder"), desc: tr("welcome.cvBuilderDesc"), to: "/cv-builder", cta: tr("onboarding.cvCta") },
    { id: "feature-interview", icon: Zap, title: tr("welcome.mockInterview"), desc: tr("welcome.mockInterviewDesc"), to: "/interview-setup", cta: tr("onboarding.interviewCta") },
    { id: "feature-jobs", icon: TrendingUp, title: tr("welcome.jobMatch"), desc: tr("welcome.jobMatchDesc"), to: "/jobs", cta: tr("onboarding.jobsCta") },
  ] as const;

  const pricing = [
    { id: "free", name: "Free", price: "0đ", benefits: dict.pricing.benefits.free, cta: tr("pricing.cta.free"), link: "/signup", highlight: false },
    { id: "premium", name: "Premium", price: "699k/month", highlight: true, benefits: dict.pricing.benefits.premium, cta: tr("pricing.cta.premium"), link: "/premium" },
    { id: "enterprise", name: "Enterprise", price: "Contact", benefits: dict.pricing.benefits.enterprise, cta: tr("pricing.cta.enterprise"), link: "/enterprise-signup", highlight: false },
  ] as const;

  // Slider data and autoplay state
  type Slide =
    | { id: string; type: "company"; img: string; company: string; logo: string; title: string; desc: string; to: string; cta: string }
    | { id: string; type: "feature"; img: string; title: string; desc: string; to: string; cta: string };

  const slides: Slide[] = [
    {
      id: "fpt",
      type: "company",
      img: "/banner/Banner_1.png",
      company: "FPT Telecom",
      logo: "/logos/FPT_logo_2010.svg.png",
      title: "FPT Telecom đang tuyển dụng",
      desc: "Gia nhập đội ngũ công nghệ hàng đầu. Lương thưởng hấp dẫn, môi trường Agile hiện đại.",
      to: "/jobs?company=FPT%20Telecom",
      cta: "Xem việc làm",
    },
    {
      id: "athena",
      type: "company",
      img: "/banner/Banner_2.png",
      company: "Athena Hub",
      logo: "/logos/Athena-Hub.png",
      title: "Athena Hub tuyển Senior Frontend",
      desc: "React + TypeScript, UI hiện đại. Thu nhập 30–45 triệu, đãi ngộ cạnh tranh.",
      to: "/jobs?company=Athena%20Hub",
      cta: "Ứng tuyển ngay",
    },
    {
      id: "ai-interview",
      type: "feature",
      img: "/banner/Banner_3.png",
      title: "Phỏng vấn AI thời gian thực",
      desc: "Luyện tập với mô phỏng phỏng vấn bằng AI và nhận phản hồi chi tiết ngay lập tức.",
      to: "/interview-setup",
      cta: "Luyện tập ngay",
    },
  ];
  const count = slides.length;
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;
    const id = setInterval(() => {
      setCurrent((prev) => {
        const next = (prev + 1) % count;
        carouselApi.scrollTo(next);
        return next;
      });
    }, 5000);
    return () => clearInterval(id);
  }, [carouselApi, count]);

  const getInitials = (name: string) => name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const brandGradients = [
    "from-primary/20 to-primary/5",
    "from-accent/20 to-accent/5",
    "from-success/20 to-success/5",
    "from-warning/20 to-warning/5",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="gradient-primary p-2 rounded-lg shadow-glow">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-gradient">{tr("common.appName")}</span>
            </Link>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Globe className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setLang("vi")}>Tiếng Việt</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLang("en")}>English</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" asChild>
                <Link to="/login">{tr("common.signIn")}</Link>
              </Button>
              <Button className="gradient-primary shadow-glow" asChild>
                <Link to="/signup">{tr("common.getStarted")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Slider */}
      <section className="relative overflow-hidden min-h-[560px] md:min-h-[620px]">
        {/* Background image behind the hero section */}
        <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
          <img src="/hero-bg.jpg" alt="" className="h-full w-full object-cover blur-[2px] md:blur scale-100 pointer-events-none" />
          {/* Transparent dark overlay to keep foreground readable */}
          <div className="absolute inset-0 bg-black/30 md:bg-black/40" />
        </div>
        {/* Top heading over background */}
        <div className="container mx-auto px-4 pt-10 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white drop-shadow">{tr("welcome.hero")}</h1>
            <p className="text-lg text-white/90 drop-shadow">{tr("welcome.subtitle")}</p>
          </div>
          {/* Search moved here under the first text */}
          <div className="max-w-3xl mx-auto">
            <Card className="p-4 shadow-lg bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-white/20">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder={tr("welcome.searchPlaceholder")} className="pl-10" />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder={tr("welcome.locationPlaceholder")} className="pl-10" />
                </div>
                <Button className="gradient-primary shadow-glow md:w-auto w-full">
                  <Search className="h-4 w-4 mr-2" />
                  {tr("welcome.searchButton")}
                </Button>
              </div>
            </Card>
          </div>
        </div>
        <div className="container mx-auto px-4 py-6 relative z-10">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Categories column */}
            <Card className="p-0 md:col-span-1 overflow-hidden bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60">
              <div className="flex items-center gap-2 p-4 border-b">
                <div className="rounded-full p-2 bg-secondary">
                  <List className="h-4 w-4" />
                </div>
                <span className="font-semibold">{tr("categories.title")}</span>
              </div>
              <ul className="max-h-80 overflow-y-auto nice-scrollbar pr-1">
                {categories.map((c) => (
                  <li key={c}>
                    <Link
                      to={`/jobs?category=${encodeURIComponent(c)}`}
                      className="flex items-center justify-between px-4 py-3 hover:bg-secondary/60 cursor-pointer"
                    >
                      <span className="text-sm text-foreground/90 truncate">{c}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link to="/jobs" className="px-4 py-3 border-t text-sm text-primary hover:underline cursor-pointer">{tr("categories.seeAll")}</Link>
            </Card>

            {/* Slider column */}
            <div className="md:col-span-2">
              <Carousel setApi={setCarouselApi} opts={{ loop: true }} className="mx-auto">
                <CarouselContent>
                  {slides.map((s) => (
                    <CarouselItem key={s.id}>
                      <Card className="overflow-hidden border-0 shadow-lg">
                        <div className="relative h-[320px] md:h-[420px] rounded-xl">
                          <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
                          {s.type === "company" && (
                            <div className="absolute top-6 left-6 flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full shadow">
                              <img src={s.logo} alt={`${s.company} logo`} className="h-6 w-6 rounded bg-white object-contain" />
                              <span className="text-sm font-semibold text-foreground">{s.company}</span>
                            </div>
                          )}
                          <div className="absolute bottom-6 left-6 right-6 text-white">
                            <h2 className="text-2xl md:text-4xl font-bold mb-2">{s.title}</h2>
                            <p className="text-white/90 mb-4 max-w-2xl">{s.desc}</p>
                            <Button asChild variant="secondary" className="px-6">
                              <Link to={s.to}>{s.cta}</Link>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious
                  className="left-2 top-1/2 -translate-y-1/2 right-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md shadow-lg w-9 h-14 md:w-10 md:h-16 rounded-r-full disabled:opacity-40"
                />
                <CarouselNext
                  className="right-2 top-1/2 -translate-y-1/2 left-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md shadow-lg w-9 h-14 md:w-10 md:h-16 rounded-l-full disabled:opacity-40"
                />
              </Carousel>
              {/* Dots */}
              <div className="flex items-center justify-center gap-2 mt-4">
                {slides.map((s, i) => (
                  <button
                    key={`dot-${s.id}`}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => { setCurrent(i); carouselApi?.scrollTo(i); }}
                    className={`h-2.5 w-2.5 rounded-full transition-colors ${current === i ? "bg-primary" : "bg-muted"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps / Onboarding Flow */}
      <section className="relative py-16">
        {/* background: soft stripe tint + blurred blob */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-muted/30 dark:bg-muted/20" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/40 to-transparent dark:from-muted/10" />
        <div aria-hidden className="absolute -top-20 left-1/2 -translate-x-1/2 h-56 w-[70%] rounded-full bg-primary/10 blur-3xl -z-10" />
        <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">{tr("onboarding.title")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{tr("onboarding.subtitle")}</p>
        </div>
        <div className="relative max-w-6xl mx-auto">
          {/* connector line for desktop */}
          <div aria-hidden="true" className="hidden md:block absolute left-0 right-0 top-[84px] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((s, idx) => (
              <Card key={s.id} className="group relative overflow-hidden p-6 border-border/60 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                {/* decorative blob */}
                <div className="absolute -top-8 -right-10 h-28 w-28 rounded-full bg-primary/10" />
                {/* icon + index */}
                <div className="relative w-max">
                  <div className={`w-12 h-12 rounded-full grid place-items-center text-white shadow-lg ring-1 ring-white/20 bg-gradient-to-br ${s.color}`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-background ring-2 ring-border text-xs font-bold grid place-items-center">{idx + 1}</div>
                </div>

                <h3 className="mt-4 text-lg font-semibold leading-tight">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground min-h-[44px]">{s.desc}</p>

                <Button variant="outline" size="sm" asChild className="mt-4 group/btn">
                  <Link to={s.link} className="inline-flex items-center">
                    {s.cta}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                  </Link>
                </Button>
              </Card>
            ))}
          </div>
        </div>
        </div>
      </section>

      {/* Companies */}
      <section className="relative py-14" style={{backgroundColor: 'rgba(221, 188, 243, 0.5)'}}>
        {/* background: subtle gradient stripe + radial glow + dotted pattern */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-background to-muted/25 dark:to-muted/15" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent dark:from-primary/15" />
        {/* dotted pattern with fade */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent_85%)] bg-[radial-gradient(circle_at_1px_1px,_rgba(99,102,241,0.14)_1px,transparent_1px)] bg-[size:18px_18px]" />
        {/* thin top and bottom dividers */}
        <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-muted/60 to-transparent" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-muted/60 to-transparent" />
        <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">{tr("partners.title")}</h2>
          <p className="text-muted-foreground">{tr("partners.subtitle")}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {companies.map((co, idx) => (
            <Card key={co.id} className="p-4 hover:shadow-lg transition-all rounded-xl border border-border/60 bg-card">
              <div className="flex items-start gap-3">
                <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${brandGradients[idx % brandGradients.length]} ring-1 ring-border overflow-hidden flex items-center justify-center` }>
                  {co.logo ? (
                    <img src={co.logo} alt={`${co.name} logo`} className="h-full w-full object-contain p-1" loading="lazy" />
                  ) : (
                    <span className="font-bold text-foreground/90">{getInitials(co.name)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{co.role}</h3>
                  <div className="text-xs text-muted-foreground truncate">{co.name}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="secondary">{co.salary}</Badge>
                    <Badge variant="outline">{co.city}</Badge>
                  </div>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/jobs">{tr("common.apply")}</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
        </div>
      </section>

      {/* Feature shortcuts */}
      <section className="relative py-14">
        {/* background: alternating stripe (tinted) with directional gradient */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-muted/30 dark:bg-muted/20" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-accent/20 via-transparent to-primary/10 dark:from-accent/10 dark:to-primary/5" />
        <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">{tr("features.sectionTitle")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{tr("features.sectionSubtitle")}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((f) => (
            <Card key={f.id} className="p-6 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="gradient-primary p-3 rounded-lg w-fit mb-4 shadow-glow">
                <f.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-muted-foreground mb-4">{f.desc}</p>
              <Button asChild variant="outline">
                <Link to={f.to}>{f.cta}</Link>
              </Button>
            </Card>
          ))}
        </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="relative py-14" style={{backgroundColor: 'rgba(221, 188, 243, 0.5)'}}>
        {/* background: light stripe with center radial highlight + dotted pattern */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-background to-muted/25 dark:to-muted/15" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-warning/10 via-transparent to-transparent dark:from-warning/5" />
        {/* warm dotted overlay with fade */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent_85%)] bg-[radial-gradient(circle_at_1px_1px,_rgba(245,158,11,0.14)_1px,transparent_1px)] bg-[size:18px_18px]" />
        {/* thin top divider */}
        <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-muted/60 to-transparent" />
        <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">{tr("pricing.sectionTitle")}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">{tr("pricing.sectionSubtitle")}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricing.map((p) => (
            <Card key={p.id} className={`p-6 ${p.highlight ? "border-primary shadow-glow" : ""}`}>
              <div className="flex items-baseline justify-between mb-4">
                <h3 className="text-xl font-bold">{p.name}</h3>
                {p.highlight && <Badge className="gradient-primary text-white">{tr("pricing.popular")}</Badge>}
              </div>
              <div className="text-3xl font-bold mb-4">{p.price}</div>
              <ul className="space-y-2 mb-6">
                {p.benefits.map((b) => (
                  <li key={`${p.id}-${b}`} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-success" /> {b}
                  </li>
                ))}
              </ul>
              <Button asChild className={p.highlight ? "gradient-primary" : ""} variant={p.highlight ? "default" : "outline"}>
                <Link to={p.link}>{p.cta}</Link>
              </Button>
            </Card>
          ))}
        </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-10">
        <div className="container mx-auto px-4 py-10 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="gradient-primary p-2 rounded-lg shadow-glow">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">{tr("common.appName")}</span>
            </div>
            <p className="text-muted-foreground">{tr("footer.description")}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">{tr("footer.product")}</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/cv-builder">{tr("nav.cvBuilder")}</Link></li>
              <li><Link to="/interview-setup">{tr("nav.mockInterview")}</Link></li>
              <li><Link to="/jobs">{tr("nav.jobs")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">{tr("footer.company")}</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/premium">{tr("footer.pricing")}</Link></li>
              <li><Link to="/resources">{tr("footer.resources")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">{tr("footer.account")}</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/login">{tr("common.signIn")}</Link></li>
              <li><Link to="/signup">{tr("common.getStarted")}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="container mx-auto px-4 py-6 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-2">
            <span>© {new Date().getFullYear()} AI JOBMATCH. All rights reserved.</span>
            <div className="flex gap-4">
              <Link to="#">{tr("footer.terms")}</Link>
              <Link to="#">{tr("footer.privacy")}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
