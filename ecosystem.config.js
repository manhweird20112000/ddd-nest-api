/**
 * PM2 process file for API gateway.
 * Usage: pm2 start ecosystem.config.js
 */
module.exports = {
  apps: [
    {
      name: 'api-gateway',
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
