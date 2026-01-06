
# MyNotes – Intelligent Note-Taking Platform

MyNotes is a full-stack note-taking application built with Next.js 14, TypeScript, and Supabase. It supports rich text editing, real-time data updates, version history, and structured workspace-based organization.

![MyNotes Dashboard](screenshot.png)
![alt text](<Screenshot 2025-11-17 at 3.56.11 PM.png>)

## Features

### Rich Text Editing

* Full formatting support (bold, italic, underline, strikethrough)
* Headings, lists, quotes, and tables
* Code blocks with syntax highlighting
* Links and image support
* Text alignment tools
* Built using TipTap

### Note Management

* Create, update, and delete notes
* Pin important notes
* Archive older notes
* Auto-save every few seconds
* Export notes as HTML

### Organization Tools

* Workspaces for grouping notes
* Tag and category system
* Search and filter functionality
* Emoji support for quick visual identifiers

### Version History

* Automatic version creation
* Track all edits
* Restore previous versions at any time

### Authentication

* Email/password sign-in
* Google OAuth
* Secure session handling

### Real-Time Functionality

* Live updates across devices
* Built on Supabase Realtime

### Security

* Row Level Security (RLS)
* Protected API routes
* Secure isolation of user data

## Tech Stack

* Next.js 14, React 18, TypeScript
* Tailwind CSS, Lucide Icons
* TipTap + Lowlight editor
* Supabase (PostgreSQL, Auth, Realtime)
* Deployment on Vercel

## Installation

### Requirements

* Node.js 18 or later
* Supabase account
* Git installed

### Steps

Install dependencies:

```
npm install
```

Set up Supabase:

* Create a new Supabase project
* Run the SQL file located at `database/schema.sql`
* Obtain your API keys from the project settings

# Take-Notes App

A modern, real-time collaborative note-taking application powered by AI.

## 🚀 Features

- **Rich Text Editor**: Advanced editor with markdown support, syntax highlighting, and media embedding.
- **AI-Powered**: Summarize, translate, and enhance notes using Google Gemini AI.
- **Real-time Collaboration**: Sync notes across devices instantly with Supabase Realtime.
- **Organization**: Categorize notes, add tags, and search efficiently.
- **Secure**: Role-based access control and secure authentication.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **AI**: Google Gemini API
- **State Management**: Zustand
- **Validation**: Zod
- **Testing**: Jest, React Testing Library

# MyNotes - AI-Powered Note-Taking Application

A modern, collaborative note-taking application built with Next.js 14, Supabase, and Google Gemini AI.

## ✨ Features

- 📝 **Rich Note Editor** - Create and organize notes with markdown support
- 🤖 **AI Enhancement** - Powered by Google Gemini for intelligent text improvements
- 🔄 **Real-time Sync** - Collaborative editing with live updates
- 📁 **Workspaces** - Organize notes into shared workspaces
- 🏷️ **Categories** - Tag and categorize your notes
- 🔍 **Smart Search** - Fast full-text search across all notes
- 🔐 **Secure** - Row-level security with Supabase
- 📱 **Responsive** - Works seamlessly on desktop and mobile

## � Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account ([sign up free](https://supabase.com))
- Google AI Studio account ([get API key](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd my-notes-app-f
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GOOGLE_API_KEY=your_gemini_api_key
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the database migrations (see [Database Setup](#database-setup))
   - Enable Row Level Security policies (see [Security](#security))

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Database Setup

### Required Tables

Your Supabase project needs these tables:
- `profiles` - User profiles
- `workspaces` - Note workspaces
- `workspace_members` - Workspace collaborators
- `categories` - Note categories
- `notes` - Main notes table
- `note_versions` - Version history
- `note_collaborators` - Note sharing
- `note_categories` - Note-category relationships

### RLS Policies

Row Level Security policies are **critical** for data isolation. See `rls_verification_guide.md` for complete policy setup.

**Quick verification:**
```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

All tables should show `rowsecurity = true`.

## 🏗️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **AI:** Google Gemini API
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Type Safety:** TypeScript
- **Testing:** Jest + React Testing Library

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Dashboard pages
│   └── api/               # API routes
├── components/            # React components
│   ├── dashboard/         # Dashboard-specific components
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and configurations
├── services/              # API service layers
│   ├── notes.ts          # Note operations
│   ├── workspaces.ts     # Workspace operations
│   ├── categories.ts     # Category operations
│   └── gemini.ts         # AI integration
├── store/                 # Zustand state management
├── types/                 # TypeScript type definitions
└── utils/                 # Helper functions
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## 🔒 Security

### Environment Variables

- ✅ `GOOGLE_API_KEY` - Server-side only (in `/api` routes)
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - Public (safe to expose)
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public (safe to expose)

### Row Level Security

All database tables have RLS enabled with policies ensuring:
- Users can only access their own notes
- Workspace members can view shared workspaces
- Only workspace owners can manage members
- Proper data isolation between users

See `rls_analysis_report.md` for detailed security audit.

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Add environment variables
   - Deploy!

See `DEPLOYMENT.md` for detailed deployment instructions.

### Build Locally

```bash
# Production build
npm run build

# Start production server
npm start
```

## 📚 Documentation

- `implementation_plan.md` - Production readiness plan
- `DEPLOYMENT.md` - Deployment guide
- `rls_verification_guide.md` - Security policy setup
- `rls_analysis_report.md` - Security audit results
- `p0_fixes_verification.md` - P0 fixes verification
- `walkthrough.md` - Refactoring walkthrough

## 🛠️ Development

### Code Quality

```bash
# Lint code
npm run lint

# Type check
npm run type-check

# Format code
npm run format
```

### Architecture

This project follows a **service layer architecture**:
- **Pages** - UI and routing
- **Components** - Reusable UI elements
- **Services** - Business logic and data access
- **Hooks** - Shared stateful logic
- **Store** - Global state management

**Key Principles:**
- ✅ No direct database calls in components
- ✅ All data access through service layer
- ✅ Centralized error handling
- ✅ Type-safe throughout

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a service
- [Google Gemini](https://ai.google.dev/) - AI capabilities
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide Icons](https://lucide.dev/) - Icon library

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review the deployment guide

---

**Built with ❤️ using Next.js and Supabase**
