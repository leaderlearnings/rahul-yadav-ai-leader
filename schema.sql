-- User Table
CREATE TABLE IF NOT EXISTS "User" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" varchar(64) NOT NULL,
  "password" varchar(64),
  "name" text,
  "emailVerified" boolean NOT NULL DEFAULT false,
  "image" text,
  "isAnonymous" boolean NOT NULL DEFAULT false,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

-- Chat Table
CREATE TABLE IF NOT EXISTS "Chat" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "createdAt" timestamp NOT NULL,
  "title" text NOT NULL,
  "userId" uuid NOT NULL REFERENCES "User"("id"),
  "visibility" varchar DEFAULT 'private' NOT NULL
);

-- Message Table (v2)
CREATE TABLE IF NOT EXISTS "Message_v2" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "chatId" uuid NOT NULL REFERENCES "Chat"("id"),
  "role" varchar NOT NULL,
  "parts" jsonb NOT NULL,
  "attachments" jsonb NOT NULL,
  "createdAt" timestamp NOT NULL
);

-- Vote Table (v2)
CREATE TABLE IF NOT EXISTS "Vote_v2" (
  "chatId" uuid NOT NULL REFERENCES "Chat"("id"),
  "messageId" uuid NOT NULL REFERENCES "Message_v2"("id"),
  "isUpvoted" boolean NOT NULL,
  PRIMARY KEY ("chatId", "messageId")
);

-- Document Table
CREATE TABLE IF NOT EXISTS "Document" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "createdAt" timestamp NOT NULL,
  "title" text NOT NULL,
  "content" text,
  "kind" varchar DEFAULT 'text' NOT NULL,
  "userId" uuid NOT NULL REFERENCES "User"("id"),
  PRIMARY KEY ("id", "createdAt")
);

-- Suggestion Table
CREATE TABLE IF NOT EXISTS "Suggestion" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "documentId" uuid NOT NULL,
  "documentCreatedAt" timestamp NOT NULL,
  "originalText" text NOT NULL,
  "suggestedText" text NOT NULL,
  "description" text,
  "isResolved" boolean DEFAULT false NOT NULL,
  "userId" uuid NOT NULL REFERENCES "User"("id"),
  "createdAt" timestamp NOT NULL,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("documentId", "documentCreatedAt") REFERENCES "Document"("id", "createdAt")
);

-- Stream Table
CREATE TABLE IF NOT EXISTS "Stream" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "chatId" uuid NOT NULL REFERENCES "Chat"("id"),
  "createdAt" timestamp NOT NULL,
  PRIMARY KEY ("id")
);

-- UnansweredQuestion Table
CREATE TABLE IF NOT EXISTS "UnansweredQuestion" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "question" text NOT NULL,
  "email" varchar(255) NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL
);

-- KnowledgeChunk Table
CREATE TABLE IF NOT EXISTS "KnowledgeChunk" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "content" text NOT NULL,
  "embedding" text NOT NULL,
  "source" varchar(64) NOT NULL,
  "title" text,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);
