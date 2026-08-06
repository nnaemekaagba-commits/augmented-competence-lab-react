import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/augmented-competence-lab-react/',
  plugins: [react()],
});
