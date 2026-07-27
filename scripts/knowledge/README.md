# Knowledge seeding pipeline

Seeding is split into two stages so that one document type can be rebuilt
without re-embedding everything else.

    content/knowledge/<source>/*.md|txt|pdf
              +  inline arrays in prepare-*.ts
                        |
                        v
              data/knowledge/<source>.json
                        |
                        v
                 seed-knowledge.ts  ->  KnowledgeChunk table

## Stage 1 - prepare (offline, free)

Each script owns exactly one document type and writes a JSON artifact. No
database or embedding calls happen here, so these are safe to run repeatedly.

| Command | Source | Output |
| --- | --- | --- |
| pnpm knowledge:prepare:about | about | data/knowledge/about.json |
| pnpm knowledge:prepare:resume | resume | data/knowledge/resume.json |
| pnpm knowledge:prepare:linkedin | linkedin | data/knowledge/linkedin.json |
| pnpm knowledge:prepare:process | process | data/knowledge/process.json |
| pnpm knowledge:prepare | all four | all four artifacts |

Every prepare script pulls from two places and concatenates them:

1. An inline array in the script itself, for short hand-written chunks.
2. Files in content/knowledge/<source>/ - see that folder's README.

Chunks whose content is still a bracketed placeholder, for example
[PASTE POST CONTENT HERE], are dropped with a warning and never reach the
vector database. Duplicate titles within a source raise an error.

## Feeding documents

Drop .md, .markdown, .txt or .pdf files into content/knowledge/<source>/ and
they are picked up automatically on the next prepare run. Nested folders are
walked recursively; unsupported extensions are skipped with a warning.

Markdown is split per heading so each chunk stays inside one section and
inherits its heading path. Plain text and PDF text are packed paragraph by
paragraph to roughly 250 words, capped at 400, with 40 words of overlap carried
into the next chunk. Over-long paragraphs are split on sentence boundaries.

PDF support needs the pdf-parse package, which is in dependencies. It is
required lazily, so if you never add a PDF you never load it.

Each document-derived chunk records an origin field in the artifact, so any
retrieved answer can be traced back to the file it came from.

## Stage 2 - seed (hits the database, costs embedding calls)

    pnpm knowledge:seed                  # every source that has an artifact
    pnpm knowledge:seed resume           # just the resume
    pnpm knowledge:seed resume linkedin  # several sources
    pnpm knowledge:seed resume --keep    # append instead of replacing

By default seeding a source clears that source first, so a re-seed replaces
rather than duplicates. Sources you do not name are left untouched. If an
artifact is missing the source is skipped with a warning rather than failing.

A 3 second pause separates embedding calls to stay inside free tier rate
limits, and lib/db/rag.ts retries with backoff on HTTP 429.

## Typical workflow

    # add or edit a source document, then
    pnpm knowledge:prepare:resume
    # inspect data/knowledge/resume.json
    pnpm knowledge:seed resume

## Files

| File | Responsibility |
| --- | --- |
| types.ts | Shared types, artifact read/write, validation |
| loaders.ts | File extension -> plain text |
| chunker.ts | Plain text -> retrieval-sized chunks |
| documents.ts | Walk a content folder, load, chunk, title |
| prepare-*.ts | One document type each |
| prepare-all.ts | Runs all four |

## Adding a new document type

1. Add the name to KnowledgeSource and KNOWLEDGE_SOURCES in types.ts.
2. Add the same name to the source union in lib/db/rag.ts.
3. Copy an existing prepare script and register it in prepare-all.ts.
4. Add a pnpm script entry in package.json.
5. Create content/knowledge/<new-source>/ if you want file-based input.

## Adding a new file format

Register a loader in loaders.ts keyed by the lowercase extension, requiring any
dependency lazily inside the loader. For .docx that would be mammoth.
