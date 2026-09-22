import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      proxy: {
        // "/v1": {
        "/api/webex": {
          target: `https://api.wxcc-us1.cisco.com/search?orgId=${env.ORG_ID_WEBEX}`,
          // target: "https://analytics.webexapis.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/webex/, ""),
          headers: {
            Authorization: `Bearer ${env.API_KEY_WEBEX}`,
          },
        },
      },
    },
  };
});
