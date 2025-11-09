# ProBono Frontend

> A modern web application for exploring, comparing, and analyzing companies and their EULA (End User License Agreement) documents.

<div align="center">

[![React](https://img.shields.io/badge/React-19-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-^7.1.7-purple.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC.svg?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn/ui-black.svg?style=for-the-badge&logo=shadcn-ui)](https://ui.shadcn.com/)

</div>

---

## 🎥 Demo
![ProBono Demo](ProBono-launch.gif)

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/i2mWasil/eudia-hackathon-frontend.git
cd eudia-hackathon-frontend/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create a `.env` file from the example:
```bash
cp example.env .env
```
Then, edit the `.env` file with your API keys and server URL:
```env
VITE_SERVER_URL=your-backend-api-url
GEMINI_API_KEY=your-gemini-api-key
```

### 4. Run the Application
```bash
npm run dev
```
The application will be available at **`http://localhost:3000`**.

---

## 📦 Build for Production

To create an optimized production build, run:
```bash
npm run build
```
The production-ready files will be generated in the `dist` folder.

---

## 📁 Project Structure

A brief overview of the key directories:
```
frontend/
├── src/
│   ├── components/    # Reusable React components
│   ├── pages/         # Page-level components
│   ├── lib/           # Utilities and API services
│   ├── contexts/      # React Context providers
│   └── types/         # TypeScript type definitions
└── public/            # Static assets
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | A JavaScript library for building user interfaces |
| **TypeScript** | A typed superset of JavaScript for robust code |
| **Vite** | A next-generation frontend build tool and dev server |
| **Tailwind CSS** | A utility-first CSS framework for rapid styling |
| **shadcn/ui** | A collection of beautifully designed, accessible components |
| **React Router** | A library for declarative routing in React applications |

---

## 🐛 Troubleshooting

<details>
<summary><b>Port already in use?</b></summary>

If you see an error about port 3000 being in use, you can change it in `vite.config.ts`:
```typescript
// vite.config.ts
export default defineConfig({
  // ...
  server: {
    port: 3001, // Or any other available port
  },
});
```
</details>

<details>
<summary><b>Build errors after pulling changes?</b></summary>

Sometimes dependencies can get out of sync. Try a clean reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```
</details>

<details>
<summary><b>Environment variables not loading?</b></summary>

Ensure that:
- Your `.env` file is located in the `frontend` directory.
- All client-side variables are prefixed with `VITE_`.
- You have restarted the development server after making changes to `.env`.
</details>

---

## 📄 License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.

---

<div align="center">
  **Built for the Eudia Hackathon**
</div>
