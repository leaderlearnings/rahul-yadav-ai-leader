import Link from "next/link";
import { Suspense } from "react";
import { list } from "@vercel/blob";

export const metadata = {
  title: "Learnings - Rahul Yadav",
  description: "A diary of notes, learnings, and reflections.",
};

type Post = {
  slug: string;
  title: string;
  uploadedAt: string;
};

function slugToTitle(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

async function getPosts(): Promise<Post[]> {
  try {
    const { blobs } = await list({ prefix: "blog/" });
    return blobs
      .filter((b) => b.pathname.endsWith(".md"))
      .map((b) => {
        const slug = b.pathname.replace(/^blog\//, "").replace(/\.md$/, "");
        return {
          slug,
          title: slugToTitle(slug),
          uploadedAt: b.uploadedAt ? new Date(b.uploadedAt).toISOString() : "",
        };
      })
      .sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1));
  } catch {
    return [];
  }
}

async function PostList() {
  const posts = await getPosts();

  if (posts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-stone-300 p-8 text-center font-serif text-sm text-stone-500">
        <p>The diary is empty for now.</p>
        <p className="mt-2">
          Add markdown files under the {String.raw`"blog/"`} prefix in Vercel Blob
          (run {String.raw`scripts/seed-blog.ts`}) and entries will appear here.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-5">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            href={`/blog/${post.slug}`}
            className="group block rounded-sm border border-stone-200 bg-white/70 p-5 shadow-sm transition-transform hover:-rotate-1 hover:shadow-md dark:border-stone-700 dark:bg-stone-800/60"
          >
            {post.uploadedAt ? (
              <p className="font-serif text-xs uppercase tracking-widest text-stone-400">
                {new Date(post.uploadedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            ) : null}
            <h2 className="mt-1 font-serif text-2xl group-hover:underline">{post.title}</h2>
            <span className="mt-2 inline-block font-serif text-sm italic text-stone-500">
              Read entry &rarr;
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function BlogPage() {
  return (
    <div className="min-h-dvh bg-[#faf6ee] text-stone-800 dark:bg-stone-900 dark:text-stone-100">
      <div className="mx-auto max-w-2xl px-6 py-14">
        <div className="mb-10 flex items-center justify-between">
          <Link href="/" className="text-sm text-stone-500 hover:underline">
            &larr; Back to chat
          </Link>
          <Link href="/resume" className="text-sm text-stone-500 hover:underline">
            About &rarr;
          </Link>
        </div>

        <header className="mb-12 text-center">
          <h1 className="font-serif text-4xl italic tracking-tight">My Learnings</h1>
          <p className="mt-3 font-serif text-stone-500">
            A diary of notes, reflections, and lessons along the way.
          </p>
        </header>

        <Suspense
          fallback={
            <p className="text-center font-serif text-sm italic text-stone-400">
              Opening the diary&hellip;
            </p>
          }
        >
          <PostList />
        </Suspense>
      </div>
    </div>
  );
}
