/**
 * scripts/knowledge/loaders.ts
 *
 * Turns a file on disk into plain text that the chunker can split.
 *
 * Supported today:
 *   .md / .markdown  - read as-is, YAML front matter stripped
 *   .txt             - read as-is
 *   .pdf             - text extracted with pdf-parse
 *
 * ADDING A FORMAT
 * ---------------
 * Add an entry to LOADERS keyed by the lowercase file extension. Keep the
 * dependency lazily required inside the loader so people who never use that
 * format do not need the package installed. For .docx you would add mammoth:
 *
 *   ".docx": async (file) => {
 *     const mammoth = require("mammoth");
 *     return (await mammoth.extractRawText({ path: file })).value;
 *   }
 */

import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);

export type LoadedDocument = {
  /** Absolute path of the file on disk. */
  file: string;
  /** Path relative to the content root, used for titles and traceability. */
  relativePath: string;
  /** Human readable document name derived from the file name. */
  name: string;
  /** File extension, lowercase, including the dot. */
  extension: string;
  /** Extracted plain text. */
  text: string;
};

type Loader = (file: string) => Promise<string>;

/** Strip a leading YAML front matter block from markdown. */
function stripFrontMatter(text: string): string {
  if (!text.startsWith("---")) {
    return text;
  }
  const end = text.indexOf("\n---", 3);
  if (end === -1) {
    return text;
  }
  return text.slice(text.indexOf("\n", end + 1) + 1);
}

async function loadText(file: string): Promise<string> {
  return await readFile(file, "utf8");
}

async function loadMarkdown(file: string): Promise<string> {
  return stripFrontMatter(await loadText(file));
}

async function loadPdf(file: string): Promise<string> {
  let pdfParse: (data: Buffer) => Promise<{ text: string }>;

  try {
    // Import the library entry point directly. The package root runs a debug
    // branch when it thinks it is the main module, which breaks under tsx.
    pdfParse = require("pdf-parse/lib/pdf-parse.js");
  } catch {
    throw new Error(
      "Reading " + path.basename(file) + " needs the pdf-parse package. Run: pnpm add pdf-parse"
    );
  }

  const parsed = await pdfParse(await readFile(file));
  return parsed.text;
}

export const LOADERS: Record<string, Loader> = {
  ".md": loadMarkdown,
  ".markdown": loadMarkdown,
  ".txt": loadText,
  ".pdf": loadPdf,
};

export const SUPPORTED_EXTENSIONS = Object.keys(LOADERS);

export function isSupported(file: string): boolean {
  return SUPPORTED_EXTENSIONS.includes(path.extname(file).toLowerCase());
}

/** Convert a file name into a readable document title. */
export function documentName(file: string): string {
  return path
    .basename(file, path.extname(file))
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Load one file into plain text. Throws when the extension is unsupported. */
export async function loadDocument(
  file: string,
  contentRoot: string
): Promise<LoadedDocument> {
  const extension = path.extname(file).toLowerCase();
  const loader = LOADERS[extension];

  if (!loader) {
    throw new Error(
      "Unsupported file type " + extension + " for " + file +
        ". Supported: " + SUPPORTED_EXTENSIONS.join(", ")
    );
  }

  const text = await loader(file);

  return {
    file,
    relativePath: path.relative(contentRoot, file).split(path.sep).join("/"),
    name: documentName(file),
    extension,
    text,
  };
}
