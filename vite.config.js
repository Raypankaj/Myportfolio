import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Replace 'your-repo-name' with the actual name of your GitHub repository
const repoName = '/Myportfolio'; 

export default defineConfig({
  plugins: [react()],
  base: `/${repoName}/`, // CRITICAL: Sets the base URL for asset loading
});