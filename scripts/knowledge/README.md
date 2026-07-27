# Knowledge seeding pipeline

Seeding is split into two stages so that one document type can be rebuilt
without re-embedding everything else.

    prepare-*.ts  ->  data/knowledge/<source>.json  ->  seed-knowledge.ts  ->  KnowledgeChunk

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

Chunks whose content is still a bracketed placeholder, for example
[PASTE POST CONTENT HERE], are dropped with a warning and never reach the
vector database. Duplicate titles within a source raise an error.

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

## Adding content

1. Edit the relevant prepare script - it is plain data, no seeding logic.
2. Run that prepare script and inspect the JSON artifact.
3. Seed just that source.

## Adding a new document type

1. Add the name to KnowledgeSource and KNOWLEDGE_SOURCES in types.ts.
2. Add the same name to the source union in lib/db/rag.ts.
3. Copy an existing prepare script and register it in prepare-all.ts.
4. Add a pnpm script entry in package.json.
