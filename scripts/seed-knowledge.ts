/**
 * scripts/seed-knowledge.ts
 *
 * CLI script to seed Rahul's knowledge into the vector database.
 * Run with: npx tsx scripts/seed-knowledge.ts
 *
 * HOW TO ADD CONTENT:
 * 1. Add your content to the DATA array below (or load from files)
 * 2. Run this script locally: npx tsx scripts/seed-knowledge.ts
 * 3. The script will generate embeddings and insert into the KnowledgeChunk table
 *
 * CRUD OPERATIONS:
 * - Add:    Run this script with new entries in the DATA array
 * - Update: Change the content and re-run (old entry stays, new one added - then delete old by id)
 * - Delete: Use clearChunksBySource() to wipe a whole category, or delete by id via SQL
 * - View:   SELECT * FROM "KnowledgeChunk" ORDER BY "createdAt" DESC; in Neon Console
 *
 * SOURCES:
 * - 'resume'   : Work history, education, skills, achievements
 * - 'linkedin' : LinkedIn posts / thought leadership content
 * - 'about'    : Elevator pitch, summary, personal philosophy
 * - 'process'  : How-to guides, frameworks, processes Rahul uses
 */

import "dotenv/config";
import { clearChunksBySource, upsertChunk } from "../lib/db/rag";

// ============================================================
// STEP 1: Edit the DATA arrays below with Rahul's content
// Each entry becomes one searchable chunk in the vector DB
// Keep each chunk focused on ONE topic (150-400 words ideal)
// ============================================================

const ABOUT: Array<{ title: string; content: string }> = [
  {
    title: "Professional Summary",
    content: [
      "Rahul Yadav is a Strategic Engineering Leader focused on Data Platforms and AI Transformation.",
      "He is an innovative and empathetic leader with 14+ years of experience driving enterprise transformation through AI-powered platforms, scalable architecture, and cross-functional collaboration.",
      "He has a proven track record of aligning stakeholders, building business cases, and delivering measurable impact across customer experience, data strategy, and cloud optimization.",
      "He is passionate about connecting people, platforms, and purpose to shape the future of context engineering and AI adoption.",
      "Contact: ryconnect@gmail.com, +1-215-821-6269, linkedin.com/in/ryaddress",
    ].join(" "),
  },
  {
    title: "Core Competencies",
    content: [
      "Rahul's core competencies include:",
      "Operational AI and Agentic Systems;",
      "Business Case Development and KPI Alignment;",
      "Cross-Functional Leadership;",
      "Cloud, FinOps and Cost Optimization;",
      "Agile, SAFe, and Product Lifecycle Management;",
      "Data Governance, Analytics, and Visualization;",
      "Executive Communication and Strategic Planning;",
      "Enterprise Eventing and Data Architecture.",
    ].join(" "),
  },
];

const RESUME: Array<{ title: string; content: string }> = [
  {
    title: "Manager 1, Software and Development Engineering - Comcast (Mar 2022 to Present)",
    content: [
      "As Manager 1, Software and Development Engineering at Comcast in Philadelphia, PA (Mar 2022 to Present), Rahul:",
      "Leads the Customer Timeline (System of Record) platform, enabling Journey Visualization, Agentic AI and Analytics across 100TB/month CX data of 30M customers, supporting critical uptime of 99.999% and low latency of 50ms.",
      "Developed and presented business cases for AI initiatives and self-service Data Governance, securing stakeholder alignment, priorities and funding.",
      "Achieved 90%+ quarterly commitment conversion rate through strategic planning and agile execution.",
      "Saved $2M+ (12% YoY) in OpEx via cloud cost optimization and architectural improvements.",
      "Spearheaded centralized data lake consolidation and led engineering team rebranding.",
      "Presented a GenAI chatbot on the main stage at Xplore 2024, which led to the Explain My Bill GenAI solution in production, reducing bill-related call handling time by more than 70 seconds.",
      "Conducted SWOT analysis to pivot the platform vision toward a CDP (Customer Data Platform) strategy.",
      "Mentored global teams and built hiring processes to scale talent acquisition.",
      "Was an integral member of the Reliability Leader Network (RLN) team, achieving resiliency company-wide through cross-organization process development working with VPs and other stakeholders.",
      "Built dynamic cross-team relationships across external and internal teams to deliver key use cases such as Data Consolidation with DX, CPP, OCFL, and EBI.",
    ].join(" "),
  },
  {
    title: "Senior Software Engineer (Java, Python) - Comcast (Jun 2019 to May 2022)",
    content: [
      "As Senior Software Engineer (Java and Python) at Comcast in Philadelphia, PA (Jun 2019 to May 2022), Rahul:",
      "Built scalable customer analytics platforms in AWS processing over 80 billion records per month.",
      "Developed Data Science churn and recommendation models to improve customer retention.",
      "Created a trouble customer monitor and easy data producer onboarding platforms.",
      "As Solution Designer, designed many Comcast Messaging journeys including the IRR-CPP privacy flow.",
      "Was experienced in Customer Success engagement, working with syndication and client teams.",
      "Served as interim manager and scrum master.",
    ].join(" "),
  },
  {
    title: "Software Engineer (Java, Python, Angular) - Comcast (Mar 2016 to Jun 2019)",
    content: [
      "As Software Engineer (Java, Python, and Angular) at Comcast in Philadelphia, PA (Mar 2016 to Jun 2019), Rahul:",
      "Owned the full software lifecycle for CX platforms.",
      "Enabled automation and analytics reporting for new business use cases.",
      "Served as Tech Lead, scrum master, and solution designer.",
    ].join(" "),
  },
  {
    title: "Full Stack Engineer - Ingenta, New Cycle Solutions, Jet Mobile, BizInfosoft (2012 to 2016)",
    content: [
      "As Full Stack Engineer (Java, Python, and Angular) across Ingenta (NJ/UK, May 2015 to Mar 2016), New Cycle Solutions (Bloomington, MN, Jan 2015 to May 2015), Jet Mobile (Paris, FR, Jan 2012 to Jan 2015), and BizInfosoft (Paris, FR, Jan 2012 to Jan 2015), Rahul:",
      "Owned the full software lifecycle for different products.",
      "Minimized the response time of secure printing from 27 seconds to 4 seconds by optimizing a code library.",
      "Became a domain expert and then Operation lead, building a process around a stable release cycle.",
      "Achieved the Tech Lead title in early 2014 and served as scrum master.",
    ].join(" "),
  },
  {
    title: "Education and Certifications",
    content: [
      "Rahul's education and certifications include:",
      "M.Tech, Computer Science from Jagannath University, Jaipur;",
      "CS50 Introduction to Artificial Intelligence with Python (Harvard University);",
      "Certified in Data Science and Modelling (Data Science Academy);",
      "SAFe 6 Agilist (Comcast Training).",
    ].join(" "),
  },
  {
    title: "Awards and Recognition",
    content: [
      "Rahul's awards and recognition include:",
      "2024 Ideator Award for an AI chatbot product reducing CX root cause analysis time from hours to seconds;",
      "2024 WHOA! Award for a Gen AI implementation saving 70+ cents per call for the Explain My Bill use case;",
      "People Choice Manager Award (nominee for Living the Culture);",
      "Circle of Success (x2) in the Comcast Innovation Category;",
      "Learn and Grow Leadership Development Program.",
    ].join(" "),
  },
  {
    title: "Other Leadership Experience",
    content: [
      "Rahul's other leadership experience includes:",
      "Board Member Lead for Asia Pacific Americans @ Comcast, leading the Professional Development team;",
      "Project Lead for LP3 Non-Profit, leading the Financial Strategy team via Compass Pro Bono;",
      "P3 Founder @ Comcast, organizing Comcast-level Ping Pong Tournaments for 3 years.",
    ].join(" "),
  },
];

const LINKEDIN: Array<{ title: string; content: string }> = [
  // Paste each LinkedIn post as a separate entry
  // Title: topic or date of post
  {
    title: "LinkedIn Post: [Topic]",
    content: "[PASTE POST CONTENT HERE]",
  },
];

const PROCESS: Array<{ title: string; content: string }> = [
  {
    title: "How I Build High-Performance Teams",
    content: "[ADD YOUR PROCESS / FRAMEWORK HERE]",
  },
];

// ============================================================
// STEP 2: Run the seeding (no edits needed below this line)
// ============================================================

async function seed() {
  console.log("Starting knowledge seeding...");

  // Clear existing chunks for each source before re-seeding
  // Comment out if you want to ADD (not replace) content
  console.log("Clearing existing chunks...");
  await clearChunksBySource("about");
  await clearChunksBySource("resume");
  await clearChunksBySource("linkedin");
  await clearChunksBySource("process");

  // Seed ABOUT
  console.log(`Seeding ${ABOUT.length} about chunks...`);
  for (const item of ABOUT) {
    await upsertChunk({ content: item.content, source: "about", title: item.title });
    process.stdout.write(".");
  }

  // Seed RESUME
  console.log(`\nSeeding ${RESUME.length} resume chunks...`);
  for (const item of RESUME) {
    await upsertChunk({ content: item.content, source: "resume", title: item.title });
    process.stdout.write(".");
  }

  // Seed LINKEDIN
  console.log(`\nSeeding ${LINKEDIN.length} linkedin chunks...`);
  for (const item of LINKEDIN) {
    await upsertChunk({ content: item.content, source: "linkedin", title: item.title });
    process.stdout.write(".");
  }

  // Seed PROCESS
  console.log(`\nSeeding ${PROCESS.length} process chunks...`);
  for (const item of PROCESS) {
    await upsertChunk({ content: item.content, source: "process", title: item.title });
    process.stdout.write(".");
  }

  console.log("\nDone! Knowledge seeded successfully.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
