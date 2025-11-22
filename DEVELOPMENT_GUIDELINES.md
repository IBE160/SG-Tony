# Development Guidelines - Musikkfabrikken

## 🇳🇴 Norwegian Language Requirement

**CRITICAL: All user-facing content MUST be in Norwegian (Bokmål)**

### What Must Be in Norwegian:

1. **UI Text & Labels**
   - All buttons, form labels, navigation items
   - Placeholder text in inputs
   - Error messages and success notifications
   - Help text and tooltips
   - Empty states and loading messages

2. **SEO & Metadata**
   - Page titles (`<title>` tags)
   - Meta descriptions
   - Open Graph tags
   - Keywords
   - Alt text for images
   - HTML lang attribute: `lang="nb"` (Norwegian Bokmål)

3. **Content**
   - Page headings and body text
   - Marketing copy
   - Instructions and onboarding
   - Email templates (if any)
   - Terms of service, privacy policy

4. **Data Content**
   - Genre names and descriptions
   - Default song titles
   - System-generated messages

### What Can Be in English:

1. **Code & Technical**
   - Variable names, function names, class names
   - Code comments (Norwegian or English acceptable)
   - Git commit messages (English preferred for international collaboration)
   - Technical documentation in `/docs` (English)
   - API endpoint names
   - Database column names

2. **Development**
   - This README and development guides (English)
   - Architecture documentation (English)
   - Technical specifications (English)

### Language Configuration:

**HTML Language:**
```tsx
<html lang="nb"> // Norwegian Bokmål
```

**Metadata Example:**
```tsx
export const metadata: Metadata = {
  title: "Musikkfabrikken - Lag norske sanger med AI",
  description: "AI-drevet norsk sanggenerator...",
  openGraph: {
    locale: "nb_NO",
  },
};
```

**Locale Settings:**
- Primary locale: `nb_NO` (Norwegian Bokmål, Norway)
- Date format: Norwegian standard (dd.mm.yyyy)
- Number format: Norwegian standard (spaces as thousand separator)

### Translation Guidelines:

**Tone & Style:**
- Friendly and approachable (ikke formelt)
- Use "du" (not "De") - informal address
- Playful language matching Norwegian culture
- Avoid direct English translations - adapt to Norwegian idioms

**Common Translations:**
- "Create Song" → "Lag sang"
- "Generate" → "Generer" or "Lag"
- "My Songs" → "Mine sanger"
- "Settings" → "Innstillinger"
- "Share" → "Del"
- "Download" → "Last ned"
- "Delete" → "Slett"
- "Cancel" → "Avbryt"
- "Save" → "Lagre"
- "Edit" → "Rediger"

**Error Messages:**
- "Something went wrong" → "Noe gikk galt"
- "Try again" → "Prøv igjen"
- "Oops!" → "Oida!" or "Uff da!"
- "Success!" → "Suksess!" or "Det fungerte!"

### Testing Language:

**Verify Norwegian Content:**
- Check all user-facing text is in Norwegian
- Test with Norwegian screen readers
- Verify date/time formats use Norwegian conventions
- Check currency displays NOK (Norwegian Kroner)

### AI Agent Instructions:

**For future AI agents developing this codebase:**

⚠️ **MANDATORY**: When implementing ANY user-facing feature:
1. All UI text MUST be in Norwegian (Bokmål)
2. All metadata and SEO MUST be in Norwegian
3. Use `lang="nb"` in HTML
4. Set `locale: "nb_NO"` in metadata
5. Format dates/numbers according to Norwegian standards

**Examples of Correct Implementation:**

✅ **Correct:**
```tsx
<button>Lag sang</button>
<h1>Mine sanger</h1>
<p>Velkommen til Musikkfabrikken!</p>
```

❌ **Incorrect:**
```tsx
<button>Create song</button>
<h1>My songs</h1>
<p>Welcome to Musikkfabrikken!</p>
```

## Code Style Guidelines

**TypeScript Strict Mode:**
- All code must pass TypeScript strict checks
- No `any` types unless absolutely necessary
- Proper type definitions for all props and functions

**ESLint:**
- Follow Next.js recommended ESLint rules
- No errors allowed, warnings should be minimized

**Naming Conventions:**
- Components: PascalCase (e.g., `GenreCarousel.tsx`)
- Files: kebab-case (e.g., `song-player-card.tsx`)
- Functions: camelCase (e.g., `generateSong()`)
- Constants: UPPER_SNAKE_CASE (e.g., `CREDIT_COSTS`)

**Import Order:**
1. External libraries (React, Next.js, etc.)
2. Internal components (`@/components`)
3. Internal utilities (`@/lib`)
4. Types (`@/types`)
5. Styles

**Component Structure:**
```tsx
// 1. Imports
import { useState } from 'react'
import { Button } from '@/components/ui/button'

// 2. Types
interface ComponentProps {
  title: string;
}

// 3. Component
export function Component({ title }: ComponentProps) {
  // 4. Hooks
  const [state, setState] = useState()

  // 5. Event handlers
  const handleClick = () => {}

  // 6. Render
  return <div>...</div>
}
```

## Git Commit Guidelines

**Commit Message Format:**
```
<type>: <description in English>

[optional body in English]
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Build process or auxiliary tool changes

**Examples:**
- `feat: add genre carousel component`
- `fix: correct Norwegian pronunciation in lyrics`
- `docs: update README with Norwegian language requirement`

## References

- [Architecture Document](./docs/architecture.md)
- [Product Requirements](./docs/prd.md)
- [UX Design Specification](./docs/ux-design-specification.md)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Remember: Norwegian content for users, English for development!** 🇳🇴
