module.exports = {
  apps: [
    {
      name: "hunter3dvisual",
      script: "cmd",
      args: "/c npx next dev --turbopack --port 3001",
      cwd: "D:\\Hunter3DVisual_Workspace",
      interpreter: "none",
      env: {
        NODE_ENV: "development",
        PORT: "3001",
      },
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 3000,
    },
  ],
};
