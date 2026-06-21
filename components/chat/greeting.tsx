import { motion } from "framer-motion";
import Link from "next/link";

export const Greeting = () => {
  return (
    <div className="flex flex-col items-center px-4" key="overview">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-center font-semibold text-2xl tracking-tight text-foreground md:text-3xl"
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.35, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        Hi, I&apos;m Artificial Rahul Yadav(ARY) 👋
      </motion.div>
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 text-center text-muted-foreground/80 text-sm"
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        Ask me anything about Rahul &mdash; his experience, skills, or background.
      </motion.div>
      <motion.nav
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 flex items-center gap-2 text-sm"
        initial={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.62, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link
          href="/resume"
          className="rounded-full border border-border px-4 py-1.5 font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
        >
          About
        </Link>
        <Link
          href="/blog"
          className="rounded-full border border-border px-4 py-1.5 font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
        >
          Learnings
        </Link>
      </motion.nav>
    </div>
  );
};
