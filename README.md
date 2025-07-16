# sasstify-frontend-template
React + Tailwind + Shadcn + TypeScript + Vite + Webpack template for building modern SaaS frontends

## 📦 Tech Stack

This template uses a hybrid approach: **Vite** for development (fast dev server, HMR) and **Webpack** for production (advanced optimization and control).

### 🧱 Core Libraries

- **React 19** – Declarative UI framework
- **React DOM** – DOM rendering for React
- **React Router v7** – Routing and layout support
- **TypeScript** – Static typing for large-scale apps

### 🎨 Styling

- **Tailwind CSS** – Utility-first CSS framework
- **@tailwindcss/typography** – Typography plugin
- **tailwindcss-animate** – Pre-built utility animations
- **tailwind-variants** – Component-level styling utilities
- **tailwind-merge** – Merges Tailwind class conflicts
- **clsx** & **class-variance-authority** – Conditional class management

### 💡 UI Components & Icons

- **Lucide React** – Lightweight, consistent icon set
- **React Icons** – Access to popular icon libraries

### 🔌 State & Data

- **@tanstack/react-query** – Async data management and caching

### ⚙️ Tooling

- **Vite** – Fast dev server and HMR
- **Webpack 5** – Advanced production bundler
- **Babel** – JavaScript and TypeScript transpilation
- **ESLint** – Static code analysis
- **TypeScript ESLint** – Type-aware linting
- **Terser** – JavaScript minification
- **CSS Minimizer Plugin** – CSS optimization
- **Mini CSS Extract Plugin** – CSS extraction from JS
- **HTML Webpack Plugin** – Template injection
- **Copy Webpack Plugin** – Asset copying
- **PurgeCSS** – Unused CSS removal

## ⚙️ Webpack Configuration Overview

Webpack is used for **production builds** with the following setup:

### ✨ Highlights

- **Single Entry Point**: Uses `main.tsx` for bundling everything.
- **Output Splitting**: Automatically separates `header`, `footer`, and `ui` components via `splitChunks`.
- **Tree Shaking**: Unused exports are removed.
- **Code Minification**:
  - `TerserPlugin` removes console logs and comments.
  - `CssMinimizerPlugin` compresses Tailwind and other styles.
- **Performance Budget**: Warns if an entrypoint exceeds 244KB to ensure SaaS frontend performance.
- **HTML Generation**: Injects bundles into `index.html` using `html-webpack-plugin`.
- **Asset Handling**:
  - Static images: moved to `static/images/`
  - CSS: moved to `static/css/`
  - JS: moved to `static/js/`

### 🧱 Directory Copying
This copies the built index.html to dashboard/index.html, enabling client-side routes like /dashboard to be statically served — useful for deployment on platforms like Netlify, GitHub Pages, or Vercel without needing server-side rewrites.

✅ Advantage: Reduces deployment cost by eliminating backend dependency for routing fallback.

## 📁 Project Structure
### Project Structure

- **CODE_OF_CONDUCT.md**  
  Guidelines and rules for contributing to the project.

- **LICENSE**  
  The license file (e.g., MIT, Apache 2.0) specifying terms of use.

- **README.md**  
  This documentation file explaining the project.

- **components.json**  
  Configuration or metadata related to UI components.

- **eslint.config.js**  
  Configuration for ESLint, the JavaScript/TypeScript linter.

- **index.html**  
  The main HTML template used by Vite for development.

- **index.webpack.html**  
  HTML template used by Webpack for production builds.

- **node_modules/**  
  Folder containing all installed npm dependencies.

- **package.json**  
  Lists dependencies, scripts, and project metadata.

- **package-lock.json**  
  Automatically generated lock file to ensure consistent installs.

- **postcss.config.js**  
  Configuration for PostCSS plugins used in CSS processing.

- **public/**  
  Static assets served directly without processing.

- **tailwind.config.ts**  
  Configuration file for Tailwind CSS customization.

- **tsconfig.app.json**  
  TypeScript configuration for the application source code.

- **tsconfig.json**  
  Base TypeScript configuration shared across the project.

- **tsconfig.node.json**  
  TypeScript configuration specifically for Node.js environment.

- **vite.config.ts**  
  Configuration for the Vite build tool used during development.

- **webpack.prod.cjs**  
  Webpack configuration file for production builds.

- **src/**  
  Main source folder containing application code:
  - **App.tsx**  
    Root React component of the application.
  - **main.tsx**  
    Entry point file that bootstraps the React app.
  - **vite-env.d.ts**  
    TypeScript environment declarations for Vite.
  - **components/**  
    Folder containing reusable React UI components.
  - **pages/**  
    Folder containing page-level components or views.
  - **hooks/**  
    Custom React hooks used throughout the app.
  - **lib/**  
    Utility functions and libraries for the application.

## Getting Started

- ### Clone the Repository
  Clone the Sasstify frontend IDE repository to your local machine and navigate to the project directory.

   ```
     git clone https://github.com/Sasstify-AI-Research/sasstify-frontend-template.git
     cd sasstify-frontend-template
   ```

- ### Install Dependencies
  Ensure Node.js is installed (recommended version: v18 or higher).
Install project dependencies using npm or Yarn.
    ```
     npm install
    ```
- ### Run the Development Server
  Start the Vite development server for fast live reloading.
  ```
  npm run dev
  ```
  The application will be available at http://localhost:8080.


- ### Build for Production

  Create an optimized production build using Webpack.
  ```
   npm run build
  ```
  The output will be generated in the dist folder.


- ### Preview the Production Build

  Preview the production build locally after building.
  ```
    npm run preview
  ```
## Adding and Using shadcn UI Components

- ### Overview

  The project uses shadcn UI components built on Radix UI and Tailwind CSS for accessible and visually appealing UI elements.

- ### Install shadcn Components

  If not already installed, add shadcn UI packages using npx
  ```
  npx shadcn@latest add accordion
  ```
- ### Import Components

  Import shadcn components into your React files from the src/components folder.

  ```
   import {
     Accordion,
     AccordionContent,
     AccordionItem,
     AccordionTrigger,
   } from "@/components/ui/accordion"
  ```

- ### Use Components in JSX

  Integrate components into your JSX code.
  ```
   <Accordion type="single" collapsible>
     <AccordionItem value="item-1">
      <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
     </AccordionItem>
    </Accordion>
  ```
- ### Customize Styles
  Use Tailwind CSS utility classes along with tailwind-variants or tailwind-merge packages to compose or override styles efficiently.


- ### Add New Components
  Create new shadcn-based components in the src/components/ui directory.
  Follow shadcn’s patterns for accessibility and styling to ensure consistency.

- 💡 **Feel free to create a Pull Request** for new ideas, improvements, or enhancements—your contributions are welcome!