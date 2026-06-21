/**
 * scripts/seed-blog.ts
 *
 * Upload diary-style blog posts (markdown) to the Vercel Blob store under "blog/".
 * Run locally with: npx tsx scripts/seed-blog.ts
 *
 * REQUIREMENTS:
 * - Set BLOB_READ_WRITE_TOKEN in your .env (Vercel > Storage > your Blob store > Tokens).
 *   Reading on the deployed site uses the store automatically; only WRITING needs this token.
 *
 * HOW IT WORKS:
 * - Each entry in POSTS becomes a file at blog/<slug>.md in Blob.
 * - The /blog page lists every blog/*.md file; /blog/<slug> renders one as a diary entry.
 * - The title shown comes from the first "# Heading" line of the markdown.
 *
 * IMAGES (instant-photo / Polaroid frames):
 * - Use normal markdown image syntax: ![your caption](https://your-image-url)
 * - Every image is automatically rendered inside a Polaroid frame on the post page.
 * - Host images anywhere public (including your Blob store) and paste the URL.
 *
 * CRUD:
 * - Add/Update: add or edit an entry below and re-run (allowOverwrite replaces same slug).
 * - Delete: use del() from @vercel/blob, or remove the file in the Vercel dashboard.
 */

import "dotenv/config";
import { put } from "@vercel/blob";

type Post = { slug: string; markdown: string };

const POSTS: Post[] = [
  {
    slug: "first-entry",
    markdown: [
      "# My first entry",
      "",
      "Today I started keeping these notes. It feels a little strange to write like this,",
      "but I want a place to think out loud about the work, the wins, and the lessons.",
      "",
      "> Small reflections, written honestly, compound over time.",
      "",
      "## What I am grateful for",
      "",
      "- The teams who shipped hard things with me",
      "- The chance to keep learning in public",
      "",
      "To add a photo, drop in a markdown image and it will appear in a Polaroid frame:",
      "",
      "![A note to self](https://placehold.co/600x400/png)",
    ].join("\n"),
  },
  {
    slug: "explain-my-bill-genai",
    markdown: [
      "# Shipping Explain My Bill",
      "",
      "Presenting a GenAI chatbot on the main stage at Xplore 2024 was the spark.",
      "Turning that demo into the production Explain My Bill experience cut bill-related",
      "call handling time by more than 70 seconds per call.",
      "",
      "## What made it work",
      "",
      "- Grounding answers in customer data we already trusted",
      "- Tight KPI alignment so the business case was unambiguous",
      "- Relentless focus on latency and reliability",
    ].join("\n"),
  },
];

async function seed() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error(
      "Missing BLOB_READ_WRITE_TOKEN. Add it to your .env before running this script.",
    );
    process.exit(1);
  }

  console.log(`Uploading ${POSTS.length} blog post(s) to Blob...`);
  for (const post of POSTS) {
    const result = await put(`blog/${post.slug}.md`, post.markdown, {
      access: "public",
      contentType: "text/markdown",
      allowOverwrite: true,
    });
    console.log(`  uploaded blog/${post.slug}.md -> ${result.url}`);
  }
  console.log("Done! Visit /blog to see your entries.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Blog seeding failed:", err);
  process.exit(1);
});
