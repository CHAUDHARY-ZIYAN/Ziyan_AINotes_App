
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

Add environment variables by creating `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Start the development server:

```
npm run dev
```

The app will run at `http://localhost:3000`.

## Project Structure

```
my-notes-app/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (dashboard)/
│   │   ├── api/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── editor/
│   │   ├── dashboard/
│   │   └── notes/
│   ├── lib/
│   │   ├── supabase/
│   │   └── utils.ts
│   └── types/
│       └── supabase.ts
├── public/
└── package.json
```

## Database Schema

Core tables include:

* profiles
* workspaces
* notes
* categories
* note_versions
* note_collaborators

All tables support secure access through Supabase RLS.

## Deployment

### Vercel Deployment

1. Push your project to GitHub:

```
git add .
git commit -m "Initial commit"
git push origin main
```

2. Open Vercel and import your repository
3. Add your environment variables
4. Deploy the project

## Screenshots

* Dashboard view
* Note editor
* Workspace selector
* Pinned notes
![alt text](<Screenshot 2025-11-17 at 6.38.00 PM.png>)
![alt text](<Screenshot 2025-11-17 at 6.37.34 PM.png>)
## Key Highlights for Resume

* Developed a production-grade full-stack application using Next.js and Supabase
* Implemented automatic version control with rollback
* Designed a normalized PostgreSQL database with multi-tenant security
* Built a rich text editor with TipTap including advanced formatting features
* Integrated OAuth and real-time synchronization
* Achieved high performance through code-splitting and server rendering
* Tech stack includes Next.js, TypeScript, Supabase, TipTap, Tailwind CSS

## Future Improvements

* AI-powered features
* Mobile app
* Offline support
* Real-time multi-user collaboration
* Advanced filtering
* Note templates
* Dark mode
* Export to PDF and Markdown

## Author

Ziyan Khan
GitHub: [https://github.com/CHAUDHARY-ZIYAN]
LinkedIn: [https://www.linkedin.com/in/ziyan-khan]
Portfolio: [https://yourwebsite.com](https://yourwebsite.com)

## License

MIT License. You may use this project for learning or personal development.

