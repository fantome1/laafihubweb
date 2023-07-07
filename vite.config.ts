import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      injectRegister: 'inline',
      includeAssets: ['/favicon.ico'],
      manifestFilename: 'manifest.json',
      manifest: {
        short_name: "Laafi Hub",
        name: 'Laafi Hub',
        description: "????",
        // start_url: "/",
        // "background_color": "#EEEEEE",
        theme_color: '#63A8A2',
        display: "standalone",
        // scope: "/",
        icons: [
          {
            src: "/logo_192.png",
            type: "image/png",
            sizes: "192x192"
          }, {
            src: "/logo_512.png",
            type: "image/png",
            sizes: "512x512"
          }
        ],
        screenshots: [
          {
            src: '/images/pwa/1.png',
            type: "image/png",
            sizes: "1831x988"
          }, {
            src: '/images/pwa/2.png',
            type: "image/png",
            sizes: "1847x988"
          }
        ],
        shortcuts: [
          {
            name: "Organization",
            url: "/organization",
            icons: [
              { "src": "/images/pwa/domain.png", sizes: "48x48" },
            ]
          }, {
            name: "Devices",
            url: "/devices",
            icons: [
              { "src": "/images/pwa/devices.png", sizes: "48x48" },
            ]
          }, {
            name: "Notifications",
            url: "/notifications",
            icons: [
              { "src": "/images/pwa/notifications", sizes: "48x48" },
            ]
          }
        ]
      }
    })
  ],
})
