# Deployment Guide

This guide outlines the steps to build and deploy the "Take-Notes" application.

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- A Supabase project (for database and authentication)
- A Google Gemini API key (for AI features)

## Environment Variables

Ensure the following environment variables are set in your deployment environment. Refer to `.env.example` for a template.

| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |
| `GOOGLE_API_KEY` | Your Google Gemini API key |

## Building for Production

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Build the Application:**
    ```bash
    npm run build
    ```
    This command compiles the application and optimizes it for production. The output will be in the `.next` directory.

3.  **Start the Server:**
    ```bash
    npm start
    ```
    This starts the production server. By default, it runs on port 3000.

## Deployment Options

### Vercel (Recommended)

1.  Push your code to a Git repository (GitHub, GitLab, Bitbucket).
2.  Import the project into Vercel.
3.  Vercel will automatically detect Next.js.
4.  Add the environment variables in the Vercel project settings.
5.  Deploy.

### Docker

(Optional: Add Dockerfile if needed in the future)

## Verification

After deployment:
1.  Visit the application URL.
2.  Sign in to verify authentication.
3.  Create a note to verify database connection.
4.  Use an AI feature (e.g., "Enhance Note") to verify the Gemini API integration.
