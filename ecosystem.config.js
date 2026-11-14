// PM2 process file for running M1 on a server (AWS EC2, Hostinger VPS, ...).
// Start:  pm2 start ecosystem.config.js --env production && pm2 save
module.exports = {
  apps: [
    {
      name: "m1-web",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      exec_mode: "cluster",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "700M",
      env_production: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
  ],
};
