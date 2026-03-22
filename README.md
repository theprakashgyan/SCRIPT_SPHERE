<div align="center">
  <h1>🚀 Script Sphere</h1>
  <p>A modern, full-stack, web-based code editor offering a clean, interactive, and developer-friendly coding experience directly in your browser.</p>
</div>

---

## 📌 Features

- **🧠 Interactive Code Editor**: Powered by Monaco Editor (the core of VS Code) for a familiar coding experience.
- **✨ Syntax Highlighting & Auto-completion**: Built-in support for multiple languages.
- **⚡ Live Code Execution**: Run code securely in the browser using the Judge0 execution engine.
- **🔐 User Authentication**: Secure login, signup, and profile management powered by Clerk.
- **💾 Save & Share Snippets**: Authenticated users can save their code snippets to the cloud and share them with others.
- **💎 Pro Tier (Monetization)**: Premium features unlocked via Lemon Squeezy integration.
- **🛠️ Scalable Architecture**: Built on Next.js 15, React 19, and Convex for real-time backend and database.

---

## 🧰 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & Backend**: [Convex](https://www.convex.dev/) (Real-time database)
- **Authentication**: [Clerk](https://clerk.dev/)
- **Code Editor**: [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react)
- **Code Execution Engine**: [Judge0](https://judge0.com/) (Extensible via RapidAPI)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Payments**: [Lemon Squeezy](https://www.lemonsqueezy.com/)

---

## 🚀 Getting Started

Follow these step-by-step instructions to set up the project locally on your machine.

### 1. Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- Git

You will also need to create free accounts for the following services to obtain API keys:
- **Clerk**: For authentication.
- **Convex**: For database.
- **RapidAPI**: For the Judge0 code execution API.

### 2. Clone the Repository

Clone the project to your local machine:

```bash
git clone https://github.com/your-username/script-sphere.git
cd script-sphere
```

### 3. Install Dependencies

Install the required npm packages:

```bash
npm install
```

### 4. Setup Environment Variables

In the root of your project, create a new file named `.env.local`:

```bash
touch .env.local
```

Copy the following template and fill in your keys:

```env
# ==========================================
# 1. Convex (Database & Backend)
# ==========================================
# Run `npx convex dev` in your terminal to automatically provision these keys
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

# ==========================================
# 2. Clerk (Authentication)
# ==========================================
# Get these from your Clerk Dashboard -> API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# ==========================================
# 3. Judge0 / Code Execution
# ==========================================
# If using the RapidAPI version of Judge0:
RAPIDAPI_KEY=your_rapidapi_key_here

# OR if you are self-hosting Judge0 (Optional):
# JUDGE0_API_URL=http://localhost:2358/submissions?base64_encoded=false&wait=true

# ==========================================
# 4. Lemon Squeezy (Payments/Pro Tier)
# ==========================================
NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_URL=https://your-store.lemonsqueezy.com/buy/your-product-id
```

### 5. Start the Convex Backend

Convex acts as the real-time database and backend functions for this project. To initialize and start Convex, run:

```bash
npx convex dev
```
*(Leave this terminal window running)*

### 6. Start the Next.js Development Server

Open a **new terminal window**, ensure you are in the project folder, and start the frontend:

```bash
npm run dev
```

### 7. View the Application

Open your browser and navigate to:
[http://localhost:3000](http://localhost:3000)

---

## 📂 Project Structure

- `/src/app/` - Next.js App Router pages and layouts.
- `/src/app/api/execute/route.ts` - The backend API route that communicates safely with the Judge0 execution engine.
- `/src/components/` - Reusable UI components.
- `/convex/` - Convex database schema and serverless backend functions.
- `/public/` - Static assets (images, icons).

---

## 💡 Troubleshooting

- **Code is not executing / Getting a 502/Bad Gateway error**:
  Ensure your `RAPIDAPI_KEY` is completely valid in your `.env.local`. If you do not have one, the app will try to fall back to the public Judge0 API, which might be permanently disabled or heavily rate-limited.
- **Authentication errors**:
  Verify your Clerk publishable and secret keys in the `.env.local` match what's in your Clerk dashboard.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/script-sphere/issues).
