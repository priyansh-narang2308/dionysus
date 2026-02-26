# Dionysus

Dionysus is an AI-powered codebase intelligence platform designed to help developers understand, search, and maintain their repositories with ease. By combining semantic search, meeting transcription, and automated commit analysis, Dionysus transforms your source code into a conversational and actionable knowledge base.

## Core Features

- **Semantic Code Search**: Search your entire codebase using natural language. Dionysus uses vector embeddings to understand the intent behind your queries and provides direct file references.
- **AI Meeting Insights**: Upload technical meetings or discussions to automatically generate transcripts, summaries, and actionable issues. Extract key decisions and technical debt directly from your conversations.
- **Smart Commit Summaries**: Stay informed on every change. Dionysus automatically analyzes new commits and generates concise AI summaries, making it easy to track development progress.
- **Context-Aware Q&A**: Ask complex questions about project logic, architecture, or specific implementations. Get accurate answers grounded in your own source code.
- **Credit-Based Indexing**: Efficient project management with a fair credit system based on the size of your repository, ensuring resources are allocated effectively.

## Technology Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Authentication**: Clerk
- **Backend API**: tRPC
- **Database**: PostgreSQL with Prisma ORM
- **AI/ML**: Google Gemini AI (Embeddings & Content Generation)
- **Transcription**: AssemblyAI
- **Billing**: Stripe
- **File Storage**: UploadThing
- **Styling**: Tailwind CSS & Motion for animations

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Bun or NPM
- PostgreSQL database (supporting pgvector)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/priyansh-narang2308/dionysus.git
   cd dionysus
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL=your_postgresql_url
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_webhook_secret
   ASSEMBLYAI_API_KEY=your_assemblyai_key
   ```

4. Initialize the database:
   ```bash
   bunx prisma db push
   ```

5. Run the development server:
   ```bash
   bun run dev
   ```

## Project Structure

- `src/app`: Next.js pages and API routes.
- `src/components`: Reusable UI components including landing page and dashboard elements.
- `src/lib`: Core utility functions for GitHub interaction, Stripe, and AI processing.
- `src/server`: tRPC router definitions and server-side logic.
- `prisma/schema.prisma`: Database schema and model definitions.

## License

Personal use or as specified by the repository owner.