import { createServer } from 'vite';
import fs from 'fs';
import path from 'path';

const startDevServer = async () => {
  const server = await createServer({
    // any valid user config options, plus `mode` and `configFile`
    configFile: './vite.config.js',
    root: process.cwd(),
    server: {
      port: 3000,
    },
  });

  await server.listen();
  server.printUrls();

  console.log('🚀 Development server started!');
  console.log('📦 Building extension...');
  
  // Watch for changes and rebuild
  const watcher = server.watcher;
  watcher.on('change', async (file) => {
    console.log(`📝 File changed: ${file}`);
    console.log('🔄 Rebuilding extension...');
  });
};

startDevServer().catch(console.error);
