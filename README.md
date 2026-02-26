# 👋 Who Am I?

An interactive developer portfolio built with **Next.js 15 (App Router)** and **TypeScript**, focused on performance, clean architecture, and modern UI.

🌐 **Live Site:** https://anshe.vercel.app  

---

## ✨ Overview

This project represents my approach to:

- Modular architecture
- Type-safe development
- Production-ready builds
- Performance optimization
- Clean UI engineering

Built using the latest Next.js App Router architecture.

---

## 🏗 Architecture

### 🧠 Application Structure

The project follows a layered modular structure:
app/ → Routing & layout (Next.js App Router)
components/ → Reusable UI components
hooks/ → Custom React hooks
utils/ → Helper functions & logic
styles/ → Global & modular styling
public/ → Static assets


---

### ⚙ Rendering Strategy

- **App Router (Server Components by default)**
- Client Components only where interaction is required
- Static optimization where possible
- Production build validation with strict TypeScript

---

### 🔁 Data & State Flow

- Component-driven architecture
- Local state via React hooks
- No unnecessary global state
- Clean separation of UI & logic

---

### 🚀 Deployment Pipeline

GitHub → Vercel CI/CD → Automatic production build

Every push triggers:

1. Dependency install
2. Type checking
3. Next.js production build
4. Optimized deployment

---

## 🛠 Tech Stack

- **Next.js 15**
- **React 18**
- **TypeScript**
- **Framer Motion**
- **Three.js**
- **CSS Modules**
- **Vercel**

---

## 📂 Folder Structure
app/
components/
├── navigation/
├── intro/
├── portfolio/
hooks/
utils/
public/
styles/


---

## 🚀 Test it locally

```bash
git clone https://github.com/anshhee/whoami-portfolio.git
cd whoami-portfolio
npm install
npm run dev



