# AIQuiz - An Intelligent Quiz Platform

AIQuiz is a modern, full-stack web application built with Next.js that allows users to take quizzes. It features role-based access control for "Students" and "Admins," secure authentication, and a clean, responsive user interface.

## Features

- **User Authentication:** Secure sign-up and sign-in functionality using JWT (JSON Web Tokens).
- **Role-Based Routing:** Distinct dashboards and permissions for **Admin** and **Student** roles, protected by middleware.
- **Quiz Management (Admin):** Admins can create, view, and manage quizzes and student results.
- **Quiz Taking (Student):** Students can view and take available quizzes.
- **Dark Mode:** A sleek, user-friendly interface with a theme toggle.
- **Secure API:** Backend API routes for handling user registration, login, and session management,quizzes generation.

## Live Deployment

🚀 **Check out the live version here:** [**Your Deployment Link Will Go Here**](https://your-aiquiz-app.vercel.app)

_(Note: Replace the link above with your actual Vercel deployment URL once deployed.)_

---

## Tech Stack

This project is built with a modern, type-safe technology stack:

- **Framework:** [Next.js](https://nextjs.org) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication:** [JWT](https://jwt.io/) with the `jose` library for security
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Form Management:** [React Hook Form](https://react-hook-form.com/)
- **Schema Validation:** [Zod](https://zod.dev/)
- **Deployment:** [Vercel](https://vercel.com)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later)
- [MongoDB](https://www.mongodb.com/try/download/community) account (you can use a free Atlas cluster)

### 1. Clone the Repository

```bash
git clone https://github.com/Tony-kan/AIQuiz.git
cd aiquiz-app
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Environment Variables

You need to create a `.env.local` file in the root of your project and add the following environment variables.

```env
# .env.local

# Get this from your MongoDB Atlas cluster connection string
MONGO_URI="mongodb+srv://<user>:<password>@cluster.mongodb.net/<database_name>?retryWrites=true&w=majority"

# A strong, secret key for signing JWTs. You can generate one here: https://generate-secret.now.sh/32
JWT_SECRET="your_super_secret_jwt_key"
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

Deployment Links:
[Vercel Platform](https://vercel.com/new).
[Netlify Platform](https://vercel.com/new).

1.  **Push your code** to a GitHub repository.
2.  **Import the project** on Vercel.
3.  **Configure Environment Variables:** Go to your project's settings on Vercel and add the `MONGO_URI` and `JWT_SECRET` environment variables. This is crucial for the deployed application to work.
4.  **Deploy!** Vercel will automatically build and deploy your application.

For more details, check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
