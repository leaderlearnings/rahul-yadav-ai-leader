import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { list } from "@vercel/blob";
import { connection } from "next/server";
import { Streamdown } from "streamdown";

async function getPost(
  slug: string,
): Promise<{ title: string; content: string; date: string } | null> {
  try {
    await connection();
    const { blobs } = await list({ prefix: `blog/${slug}.md` });
    const match = blobs.find((b) => b.pathname === `blog/${slug}.md`);
    if (!match) {
      return null;
    }
    const res = await fetch(match.url, { cache: "no-store" });
    if (!res.ok) {
      return null;
    }
    const content = await res.text();
    const headingMatch = content.match(/^#\s+(.+)$/m);
    const title = headingMatch
      ? headingMatch[1].trim()
      : slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const date = match.uploadedAt
      ? new Date(match.uploadedAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";
    return { title, content, date };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const title = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return { title: `${title} · Rahul Yadav` };
}

async function Entry({ slug }: { slug: string }) {
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      {post.date ? (
        <p className="mb-2 text-center font-serif text-xs uppercase tracking-widest text-stone-400">
          Dear diary &bull; {post.date}
        </p>
      ) : null}

      <article
        className={[
          "diary-entry font-serif text-[1.05rem] leading-8 text-stone-800 dark:text-stone-100",
          "[&_h1]:mb-6 [&_h1]:text-center [&_h1]:font-serif [&_h1]:text-3xl [&_h1]:italic",
          "[&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:font-serif [&_h2]:text-2xl",
          "[&_p]:my-4",
          "[&_a]:underline [&_a]:decoration-stone-400 [&_a]:underline-offset-2",
          "[&_blockquote]:border-l-2 [&_blockquote]:border-stone-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-stone-500",
          "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6",
          "[&_img]:mx-auto [&_img]:my-8 [&_img]:block [&_img]:w-[min(20rem,90%)] [&_img]:rotate-[-2deg]",
          "[&_img]:border-[14px] [&_img]:border-b-[56px] [&_img]:border-white [&_img]:bg-white",
          "[&_img]:shadow-[0_10px_25px_rgba(0,0,0,0.18)] [&_img]:transition-transform hover:[&_img]:rotate-0",
        ].join(" ")}
      >
        <Streamdown>{post.content}</Streamdown>
      </article>
    </>
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="min-h-dvh bg-[#faf6ee] text-stone-800 dark:bg-stone-900 dark:text-stone-100">
      <div className="mx-auto max-w-2xl px-6 py-14">
        <div className="mb-8">
          <Link href="/blog" className="text-sm text-stone-500 hover:underline">
            &larr; All entries
          </Link>
        </div>

        <Suspense
          fallback={
            <p className="text-center font-serif text-sm italic text-stone-400">
              Turning the page&hellip;
            </p>
          }
        >
          <Entry slug={slug} />
        </Suspense>
      </div>
    </div>
  );
}
