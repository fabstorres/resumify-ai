# Resume Builder with AI Suggestions

This is a web application to create, edit, and optimize resumes. Users can build their resume, get personalized improvement suggestions using AI, and apply those recommendations. The app is built with Next.js and uses Convex for backend storage.

## Features

- Build and edit resumes
- Sections for Education, Experience, Skills, and Projects
- AI-based suggestions tailored to job descriptions
- Approve or reject each improvement suggestion
- Data is saved in real time using Convex

## Getting Started

### Requirements

- Node.js 18 or later
- Package manager (npm, yarn, pnpm, or bun)
- API keys for OpenAI, Clerk, and Convex

### Installation

Clone the repository and install dependencies:

```bash
git clone [REPO_URL]
cd [PROJECT_DIRECTORY]
pnpm install
```

### Configure Environment Variables

Create a `.env.local` file in the project root and add the following:

```
OPENAI_SECRET_KEY=your_openai_api_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CONVEX_DEPLOYMENT=your_convex_deployment
CONVEX_DEPLOY_KEY=your_convex_deploy_key
```

Make sure you have accounts and keys set up for [OpenAI](https://platform.openai.com/), [Clerk](https://clerk.dev/), and [Convex](https://dashboard.convex.dev/).

### Running the development server

Start the development server using your package manager:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Directory Structure

- `app/` contains application pages and UI components
- `convex/` holds backend logic and schema for Convex
- `lib/` includes API utilities such as OpenAI integration
- `public/` contains static assets

## Deployment

To deploy, push your code to a repository and connect to a platform like [Vercel](https://vercel.com/). Make sure to set all required environment variables on your hosting provider.

For more information, refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## License

This project is licensed under the MIT License.
