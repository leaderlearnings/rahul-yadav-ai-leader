/**
 * scripts/knowledge/chunker.ts
 *
 * Splits long document text into retrieval-sized chunks.
 *
 * Strategy
 * --------
 * 1. Markdown is split on headings first, so each chunk stays inside one
 *    coherent section and inherits a heading path used for its title.
 * 2. Each section (and any non-markdown text) is then packed paragraph by
 *    paragraph up to TARGET words.
 * 3. OVERLAP words of trailing context are repeated at the start of the next
 *    chunk, so a sentence that straddles a boundary is still retrievable.
 * 4. A paragraph longer than MAX words on its own is split on sentence
 *    boundaries rather than mid-thought.
 */

export type ChunkOptions = {
  targetWords?: number;
  maxWords?: number;
  minWords?: number;
  overlapWords?: number;
};

export type TextChunk = {
  /** Heading path inside the document, for example "Experience > Comcast". */
  heading: string;
  content: string;
};

const DEFAULTS = {
  targetWords: 250,
  maxWords: 400,
  minWords: 25,
  overlapWords: 40,
};

/** Three backticks. Written as escapes so this file stays easy to embed. */
const CODE_FENCE = "\u0060\u0060\u0060";

function normalizeWhitespace(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/\t/g, " ");
}

export function countWords(text: string): number {
  const matched = text.trim().match(/\S+/g);
  return matched ? matched.length : 0;
}

function takeLastWords(text: string, count: number): string {
  const parts = text.trim().split(/\s+/);
  if (parts.length <= count) {
    return text.trim();
  }
  return parts.slice(parts.length - count).join(" ");
}

function splitSentences(paragraph: string): string[] {
  return paragraph
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n+/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

type Section = { heading: string; body: string };

/** Split markdown into sections keyed by their heading path. */
function splitMarkdownSections(text: string): Section[] {
  const lines = text.split("\n");
  const sections: Section[] = [];
  const stack: string[] = [];
  let buffer: string[] = [];
  let heading = "";
  let insideFence = false;

  const flush = () => {
    const body = buffer.join("\n").trim();
    if (body) {
      sections.push({ heading, body });
    }
    buffer = [];
  };

  for (const line of lines) {
    if (line.trimStart().startsWith(CODE_FENCE)) {
      insideFence = !insideFence;
    }

    const match = insideFence ? null : line.match(/^(#{1,6})\s+(.*)$/);

    if (match) {
      flush();
      const level = match[1].length;
      stack.length = level - 1;
      stack[level - 1] = match[2].replace(/#+\s*$/, "").trim();
      heading = stack.filter(Boolean).join(" > ");
    } else {
      buffer.push(line);
    }
  }
  flush();

  if (sections.length === 0) {
    const body = text.trim();
    return body ? [{ heading: "", body }] : [];
  }
  return sections;
}

function splitLongParagraph(paragraph: string, maxWords: number): string[] {
  const sentences = splitSentences(paragraph);
  const out: string[] = [];
  let buffer: string[] = [];
  let count = 0;

  for (const sentence of sentences) {
    const size = countWords(sentence);
    if (count > 0 && count + size > maxWords) {
      out.push(buffer.join(" "));
      buffer = [];
      count = 0;
    }
    buffer.push(sentence);
    count += size;
  }
  if (buffer.length > 0) {
    out.push(buffer.join(" "));
  }

  return out.length > 0 ? out : [paragraph];
}

function packParagraphs(
  paragraphs: string[],
  opts: Required<ChunkOptions>
): string[] {
  const chunks: string[] = [];
  let current: string[] = [];
  let currentWords = 0;

  const flush = () => {
    if (current.length === 0) {
      return "";
    }
    const text = current.join(" ").trim();
    chunks.push(text);
    current = [];
    currentWords = 0;
    return text;
  };

  for (const paragraph of paragraphs) {
    const pieces =
      countWords(paragraph) > opts.maxWords
        ? splitLongParagraph(paragraph, opts.maxWords)
        : [paragraph];

    for (const piece of pieces) {
      const size = countWords(piece);

      if (currentWords > 0 && currentWords + size > opts.targetWords) {
        const previous = flush();
        const overlap = takeLastWords(previous, opts.overlapWords);
        if (opts.overlapWords > 0 && overlap) {
          current.push(overlap);
          currentWords = countWords(overlap);
        }
      }

      current.push(piece);
      currentWords += size;
    }
  }
  flush();

  // A tiny trailing chunk retrieves badly, so fold it into its predecessor.
  if (chunks.length > 1 && countWords(chunks[chunks.length - 1]) < opts.minWords) {
    const tail = chunks.pop() as string;
    chunks[chunks.length - 1] = chunks[chunks.length - 1] + " " + tail;
  }

  return chunks;
}

/** Split document text into chunks. Set isMarkdown for heading-aware splitting. */
export function chunkText(
  text: string,
  isMarkdown: boolean,
  options: ChunkOptions = {}
): TextChunk[] {
  const opts: Required<ChunkOptions> = { ...DEFAULTS, ...options };
  const clean = normalizeWhitespace(text);

  const sections = isMarkdown
    ? splitMarkdownSections(clean)
    : [{ heading: "", body: clean.trim() }];

  const chunks: TextChunk[] = [];

  for (const section of sections) {
    const paragraphs = splitParagraphs(section.body);
    if (paragraphs.length === 0) {
      continue;
    }
    for (const content of packParagraphs(paragraphs, opts)) {
      if (countWords(content) > 0) {
        chunks.push({ heading: section.heading, content });
      }
    }
  }

  return chunks;
}
