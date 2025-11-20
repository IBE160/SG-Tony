# Musikkfabrikken

AI-powered Norwegian song creation platform - Create authentic-sounding Norwegian songs with AI-generated lyrics and Suno music production.

## Prerequisites

- **Node.js**: 18.17+ or 20.x LTS
- **npm**: 9.x+ or pnpm 8.x+
- **Git**: 2.x+

## Getting Started

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd SG-Tony
npm install
```

### 2. Environment Setup

Copy the environment template and configure your API keys:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual API credentials:
- **Supabase**: Database, authentication, and storage
- **Stripe**: Payment processing for credit purchases
- **OpenAI**: GPT-4 for Norwegian lyric generation
- **Suno API**: Music generation
- **Google AI**: Canvas generation (optional)

See `.env.example` for detailed instructions on obtaining each API key.

### 3. Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The development server uses Turbopack for fast hot module replacement.

### 4. Build

Create a production build:

```bash
npm run build
```

### 5. Start Production Server

Run the production build locally:

```bash
npm start
```

## Technology Stack

- **Framework**: Next.js 14.2+ with App Router
- **Language**: TypeScript 5.3+
- **Styling**: Tailwind CSS 3.4+
- **UI Components**: shadcn/ui (Radix UI + Tailwind)
- **Backend**: Supabase (PostgreSQL 17, Auth, Storage)
- **Payment**: Stripe
- **AI Services**: OpenAI GPT-4, Suno API, Google Gemini/Video

## Project Structure

```
SG-Tony/
├── .next/                    # Next.js build output (gitignored)
├── docs/                     # Documentation
│   ├── architecture.md       # Architecture decisions and patterns
│   ├── prd.md                # Product requirements
│   ├── ux-design-specification.md  # UX design system
│   └── epics/                # Epic and story documentation
├── node_modules/             # Dependencies (gitignored)
├── public/                   # Static assets
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── globals.css       # Global styles + Tailwind imports
│   ├── components/           # React components (to be added)
│   ├── lib/                  # Utility libraries (to be added)
│   └── types/                # TypeScript type definitions (to be added)
├── .env.example              # Environment variable template
├── .env.local                # Your local environment variables (gitignored)
├── .eslintrc.json            # ESLint configuration
├── .gitignore                # Git exclusions
├── next.config.js            # Next.js configuration
├── package.json              # Project dependencies and scripts
├── postcss.config.js         # PostCSS configuration for Tailwind
├── README.md                 # This file
├── tailwind.config.ts        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## Import Aliases

The project uses the `@/*` import alias pattern for cleaner imports:

```typescript
// Instead of: import { Button } from '../../../components/ui/button'
import { Button } from '@/components/ui/button'
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Create production build
- `npm start` - Run production server
- `npm run lint` - Run ESLint code quality checks

## Documentation

- **[Development Guidelines](./DEVELOPMENT_GUIDELINES.md)** - ⚠️ READ FIRST: Norwegian language requirements & coding standards
- [Architecture Document](./docs/architecture.md) - Technical architecture and design decisions
- [Product Requirements](./docs/prd.md) - Functional requirements and specifications
- [UX Design](./docs/ux-design-specification.md) - User experience and design system
- [Next.js Documentation](https://nextjs.org/docs) - Next.js framework guide
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Styling framework guide

## Development Guidelines

⚠️ **CRITICAL: All user-facing content and SEO MUST be in Norwegian (Bokmål)**

See [DEVELOPMENT_GUIDELINES.md](./DEVELOPMENT_GUIDELINES.md) for complete guidelines including:
- 🇳🇴 Norwegian language requirements (UI, SEO, metadata)
- TypeScript strict mode and code style
- Component structure and naming conventions
- Git commit message format

**Quick Reference:**
- **Language**: All UI text in Norwegian, code/docs in English
- **HTML lang**: `lang="nb"` (Norwegian Bokmål)
- **Locale**: `nb_NO`
- **TypeScript Strict Mode**: Enabled for type safety
- **Code Style**: ESLint with Next.js recommended rules
- **Commit Messages**: Use conventional commit format (e.g., `feat:`, `fix:`, `docs:`)
- **Branch Strategy**: Feature branches merged to `main` via pull requests

## Support

For questions or issues:
1. Check the [Architecture Document](./docs/architecture.md)
2. Review the [PRD](./docs/prd.md) for feature specifications
3. Contact the project maintainer

---

Built with ❤️ for Norwegian music creators
