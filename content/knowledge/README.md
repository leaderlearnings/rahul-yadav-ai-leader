# Source documents

Drop your raw documents here. The prepare scripts read this folder, extract the
text, split it into retrieval-sized chunks and write the result to
data/knowledge/<source>.json.

## Layout

One folder per knowledge source. Create the folders you need - a missing folder
is simply skipped.

    content/knowledge/
      about/      -> summary, bio, personal philosophy
      resume/     -> resume PDF, role write-ups
      linkedin/   -> posts and thought leadership
      process/    -> playbooks, frameworks, how-to guides

Subfolders are walked recursively, so you can organise however you like.

## Supported formats

| Extension | Handling |
| --- | --- |
| .md, .markdown | Split per heading; YAML front matter stripped |
| .txt | Split into paragraph-packed chunks |
| .pdf | Text extracted with pdf-parse, then paragraph-packed |

Anything else is ignored with a warning. To add a format, register a loader in
scripts/knowledge/loaders.ts.

## How splitting works

Markdown headings define the chunk boundaries first, so each chunk stays inside
one section and inherits its heading path as part of the title. Within a section
text is packed to roughly 250 words, capped at 400, with 40 words of overlap
carried into the next chunk so a sentence spanning a boundary is still
retrievable. Very long paragraphs are split on sentence boundaries.

Chunk titles are derived from the file name plus the heading path, for example
"rahul yadav resume - Experience > Comcast (2/6)". Every chunk records its
origin file in the artifact so you can trace any retrieved answer back to the
document it came from.

## Workflow

    pnpm knowledge:prepare:resume   # read the files, write the artifact
    # inspect data/knowledge/resume.json
    pnpm knowledge:seed resume      # embed and store

## A note on committing documents

Files placed here are committed to the repository unless you add them to
.gitignore. This repository is public, so do not add anything you would not want
published. If your source documents should stay private, add content/knowledge/
to .gitignore and keep the files locally.
