import Link from "next/link";

export const metadata = {
  title: "Rahul Yadav - Resume",
  description: "Strategic Engineering Leader | Data Platforms | AI Transformation",
};

type Role = {
  title: string;
  org: string;
  period: string;
  bullets: string[];
};

const ROLES: Role[] = [
  {
    title: "Manager 1, Software and Development Engineering",
    org: "Comcast - Philadelphia, PA",
    period: "Mar 2022 - Present",
    bullets: [
      "Lead the Customer Timeline (System of Record) platform, enabling Journey Visualization, Agentic AI and Analytics across 100TB/month CX data of 30M customers, supporting 99.999% uptime and 50ms latency.",
      "Developed and presented business cases for AI initiatives and self-service Data Governance, securing stakeholder alignment, priorities and funding.",
      "Achieved 90%+ quarterly commitment conversion rate through strategic planning and agile execution.",
      "Saved $2M+ (12% YoY) in OpEx via cloud cost optimization and architectural improvements.",
      "Presented a GenAI chatbot on the main stage at Xplore 2024, leading to the Explain My Bill solution that cut bill-related call handling time by 70+ seconds.",
      "Spearheaded centralized data lake consolidation, conducted SWOT analysis to pivot toward a CDP strategy, and mentored global teams.",
    ],
  },
  {
    title: "Senior Software Engineer (Java, Python)",
    org: "Comcast - Philadelphia, PA",
    period: "Jun 2019 - May 2022",
    bullets: [
      "Built scalable customer analytics platforms in AWS processing over 80 billion records per month.",
      "Developed Data Science churn and recommendation models to improve customer retention.",
      "As Solution Designer, designed many Comcast Messaging journeys including the IRR-CPP privacy flow.",
      "Served as interim manager and scrum master.",
    ],
  },
  {
    title: "Software Engineer (Java, Python, Angular)",
    org: "Comcast - Philadelphia, PA",
    period: "Mar 2016 - Jun 2019",
    bullets: [
      "Owned the full software lifecycle for CX platforms.",
      "Enabled automation and analytics reporting for new business use cases.",
      "Served as Tech Lead, scrum master, and solution designer.",
    ],
  },
  {
    title: "Full Stack Engineer (Java, Python, Angular)",
    org: "Ingenta, New Cycle Solutions, Jet Mobile, BizInfosoft",
    period: "2012 - 2016",
    bullets: [
      "Owned the full software lifecycle for multiple products.",
      "Minimized secure-printing response time from 27s to 4s by optimizing a code library.",
      "Became domain expert and Operation lead; achieved Tech Lead title in early 2014.",
    ],
  },
];

const COMPETENCIES = [
  "Operational AI & Agentic Systems",
  "Business Case Development & KPI Alignment",
  "Cross-Functional Leadership",
  "Cloud, FinOps & Cost Optimization",
  "Agile, SAFe & Product Lifecycle Management",
  "Data Governance, Analytics & Visualization",
  "Executive Communication & Strategic Planning",
  "Enterprise Eventing & Data Architecture",
];

const AWARDS = [
  "2024 Ideator Award - AI chatbot reducing CX root cause analysis from hours to seconds",
  "2024 WHOA! Award - Gen AI saving 70+ cents per call for Explain My Bill",
  "People Choice Manager Award - Living the Culture nominee",
  "Circle of Success (x2) - Comcast Innovation Category",
  "Learn and Grow - Leadership Development Program",
];

const EDUCATION = [
  "M.Tech, Computer Science - Jagannath University, Jaipur",
  "CS50 Introduction to AI with Python - Harvard University",
  "Certified in Data Science & Modelling - Data Science Academy",
  "SAFe 6 Agilist - Comcast Training",
];

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/" className="text-sm text-muted-foreground hover:underline">
          &larr; Back to chat
        </Link>
        <Link href="/blog" className="text-sm text-muted-foreground hover:underline">
          Learnings &rarr;
        </Link>
      </div>

      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Rahul Yadav</h1>
        <p className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">
          Strategic Engineering Leader | Data Platforms | AI Transformation
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          ryconnect@gmail.com &bull; +1-215-821-6269 &bull; linkedin.com/in/ryaddress
        </p>
      </header>

      <section className="mb-10">
        <h2 className="mb-3 border-b pb-1 text-lg font-semibold">Summary</h2>
        <p className="text-sm leading-relaxed text-foreground/90">
          Innovative and empathetic leader with 14+ years of experience driving enterprise
          transformation through AI-powered platforms, scalable architecture, and cross-functional
          collaboration. Proven success in aligning stakeholders, building business cases, and
          delivering measurable impact across customer experience, data strategy, and cloud
          optimization.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 border-b pb-1 text-lg font-semibold">Core Competencies</h2>
        <ul className="grid grid-cols-1 gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
          {COMPETENCIES.map((c) => (
            <li key={c} className="flex gap-2">
              <span className="text-muted-foreground">&bull;</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 border-b pb-1 text-lg font-semibold">Professional Experience</h2>
        <div className="space-y-6">
          {ROLES.map((role) => (
            <div key={role.title}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="font-semibold">{role.title}</h3>
                <span className="text-xs text-muted-foreground">{role.period}</span>
              </div>
              <p className="mb-2 text-sm text-muted-foreground">{role.org}</p>
              <ul className="space-y-1 text-sm leading-relaxed">
                {role.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-muted-foreground">&bull;</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 border-b pb-1 text-lg font-semibold">Education & Certifications</h2>
        <ul className="space-y-1 text-sm">
          {EDUCATION.map((e) => (
            <li key={e} className="flex gap-2">
              <span className="text-muted-foreground">&bull;</span>
              <span>{e}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 border-b pb-1 text-lg font-semibold">Awards & Recognition</h2>
        <ul className="space-y-1 text-sm">
          {AWARDS.map((a) => (
            <li key={a} className="flex gap-2">
              <span className="text-muted-foreground">&bull;</span>
              <span>{a}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
