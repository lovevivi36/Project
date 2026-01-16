import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

import { miaodaDevPlugin } from "miaoda-sc-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    svgr({
      svgrOptions: {
        icon: true, 
        exportType: 'named', 
        namedExport: 'ReactComponent',
      },
    }),
    // 只在开发环境使用 miaodaDevPlugin
    ...(process.env.NODE_ENV === 'development' ? [miaodaDevPlugin()] : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: './', // 使用相对路径，适配Electron
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // 确保资源路径正确
    assetsDir: 'assets',
    // 代码分割优化
    rollupOptions: {
      output: {
        // 确保资源文件名包含哈希，便于缓存
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        // 手动代码分割，将大型库分离
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['motion/react', 'lucide-react'],
        },
      },
    },
    // 使用 esbuild 压缩（更快，内置支持）
    minify: 'esbuild',
    // 提高 chunk 大小警告阈值
    chunkSizeWarningLimit: 1000,
  },
});
