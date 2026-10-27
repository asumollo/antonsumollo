// Everything personal on the site lives here. Edit this file and the
// markdown files in /content/projects. You shouldn't need to touch components.

export type Tool = {
  name: string;
  /** Icon key: a Simple Icons name mapped in src/components/tools.tsx, or a file in src/icons. */
  icon?: string;
};

export type ToolGroup = {
  title: string;
  tools: Tool[];
};

export type Job = {
  role: string;
  /** Leave out for freelance or self-employed work. */
  company?: string;
  start: string;
  end: string;
  summary: string;
};

export const site = {
  name: "Anton Mark Sumollo",
  shortName: "Anton Sumollo",
  initials: "AS",

  /** Put a square photo in /public (e.g. /public/profile.jpg) and set the path here. */
  photo: "/profile.webp" as string | null,

  /** The hero line types through these one by one. The first one is what loads first. */
  roles: [
    "Full-Stack Software Engineer",
    "Backend and automation",
    "AI-assisted tools",
  ],

  location: "Pampanga, Philippines",

  availability: {
    open: true,
    label: "Open",
    /** A second chip beside it. Leave empty to hide. */
    start: "Can start immediately",
  },

  /**
   * Hero paragraphs. **bold** for key terms, ==text== for the highlighted phrase.
   * The first paragraph is the large one.
   */
  bio: [
    "**Full-stack software engineer** who builds ==backend systems, automation and AI-assisted tools== that run in production.",
    "For three years I shipped and maintained the CAD automation behind **SnapMagic (YC)**, reporting directly to the CEO. Before that I was at **Analog Devices**, first in IC design and then in machine learning.",
  ],

  email: "antonmark.sumollo@gmail.com",

  /** Drop your resume in /public/resume.pdf, or point this at a hosted copy. */
  resume: "/resume.pdf",

  links: {
    github: "https://github.com/asumollo",
    linkedin: "https://www.linkedin.com/in/amssumollo",
  },

  github: {
    username: "asumollo",
    show: true,
  },

  /** Shown as "Uptime" in the hero. Year and month you started working in engineering. */
  careerStart: "2020-01",

  /** Every tool, grouped by what it's for. Shown on the home page and in the "See all" popup. */
  toolGroups: [
    {
      title: "Languages",
      tools: [
        { name: "Python", icon: "python" },
        { name: "JavaScript", icon: "javascript" },
        { name: "TypeScript", icon: "typescript" },
      ],
    },
    {
      title: "Frameworks",
      tools: [
        { name: "Django", icon: "django" },
        { name: "FastAPI", icon: "fastapi" },
        { name: "React", icon: "react" },
        { name: "Celery", icon: "celery" },
      ],
    },
    {
      title: "Data",
      tools: [
        { name: "PostgreSQL", icon: "postgresql" },
        { name: "Redis", icon: "redis" },
        { name: "Supabase", icon: "supabase" },
        { name: "BigQuery", icon: "googlebigquery" },
      ],
    },
    {
      title: "Cloud and DevOps",
      tools: [
        { name: "AWS", icon: "aws" },
        { name: "Google Cloud", icon: "googlecloud" },
        { name: "Docker", icon: "docker" },
        { name: "Cloudflare", icon: "cloudflare" },
        { name: "DigitalOcean", icon: "digitalocean" },
        { name: "Heroku", icon: "heroku" },
        { name: "New Relic", icon: "newrelic" },
        { name: "Git", icon: "git" },
      ],
    },
    {
      title: "Automation and testing",
      tools: [
        { name: "n8n", icon: "n8n" },
        { name: "Playwright", icon: "playwright" },
        { name: "Vitest", icon: "vitest" },
      ],
    },
    {
      title: "PCB design",
      tools: [
        { name: "Altium Designer", icon: "altium" },
        { name: "Eagle / Fusion", icon: "eagle" },
        { name: "OrCAD", icon: "orcad" },
        { name: "KiCad", icon: "kicad" },
        { name: "PADS", icon: "pads" },
        { name: "Siemens EDA", icon: "siemens" },
      ],
    },
  ] satisfies ToolGroup[],

  /** How many projects the home page deck shows before "All projects". More than 3 gets cramped. */
  homeProjectLimit: 3,

  experience: [
    {
      role: "Software Engineer",
      company: "SnapMagic (YC)",
      start: "Apr 2023",
      end: "Mar 2026",
      summary:
        "Worked on AI schematic generation end to end, automated CAD model generation, and maintained the VM fleet behind CAD file conversions.",
    },
    {
      role: "Freelance Developer",
      start: "Dec 2022",
      end: "Sep 2024",
      summary:
        "Part-time, alongside full-time work. Built a Python tool that scores up to 200,000 Amazon products per sheet, running on AWS EC2 with Redis and Celery. Mapped the search and opt-out flows of 30+ data broker sites. Taught Python and game development to grades 6 to 12.",
    },
    {
      role: "Design Verification Engineer / Machine Learning Engineer",
      company: "Analog Devices",
      start: "Jun 2021",
      end: "Apr 2023",
      summary:
        "Built a model that found redundant test points in ADC/DAC test programs and pruned them, cutting tester cycle time by 20%.",
    },
    {
      role: "Analog IC Design Engineer",
      company: "Analog Devices",
      start: "Jan 2020",
      end: "Jun 2021",
      summary:
        "Designed LDO and reference voltage regulator blocks. One went into a production power management chip.",
    },
  ] satisfies Job[],

  /**
   * The "Ask about me" chat. It answers from this file, your project files and
   * /content/about.md. It needs LLM_API_KEY and LLM_MODEL set (see README).
   */
  assistant: {
    enabled: true,
    suggestions: [
      "Why should we hire you?",
      "What's your main stack?",
      "Are you open to remote work?",
    ],
    offline:
      "The assistant is offline right now. You can email me at antonmark.sumollo@gmail.com and I'll reply directly.",
    /** Shown when one visitor asks too much, too fast. */
    slowDown:
      "That's a lot of questions in a short time. Try again in a minute, or email me at antonmark.sumollo@gmail.com.",
    /** Shown once the site has answered its questions for the day. */
    dailyLimit:
      "The assistant has answered all it can for today. Email me at antonmark.sumollo@gmail.com and I'll reply directly.",
    /** Questions per conversation before the drawer asks for a fresh one. */
    maxQuestions: 20,
  },

  copyrightYear: 2026,

  seo: {
    /** Change this to your real domain once it's live. */
    url: "https://example.com",
    title: "Anton Sumollo | Full-Stack Software Engineer",
    description:
      "Full-stack software engineer building backend systems, automation and AI-assisted tools. Based in the Philippines, open to remote roles.",
  },
};
