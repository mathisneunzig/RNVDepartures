import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const graphqlTarget = env.VITE_PROXY_TARGET
  const graphqlUpstreamPath = env.VITE_GRAPHQL_PATH || '/graphql'

  const tokenProxyPath = env.VITE_AAD_TOKEN_PROXY || '/aad/token'
  const tokenUrlStr = env.VITE_AAD_TOKEN_URL || ''
  const tokenUrl = new URL(tokenUrlStr)
  const tokenTarget = `${tokenUrl.protocol}//${tokenUrl.host}`
  const tokenPathname = tokenUrl.pathname

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/graphql': {
          target: graphqlTarget || 'http://localhost:9999',
          changeOrigin: true,
          secure: true,
          rewrite: () => graphqlUpstreamPath,
          headers: { accept: 'application/json' },
          configure: (proxy) => {
            proxy.on('proxyReq', (req) => {
              req.setHeader('accept', 'application/json')
              req.setHeader('content-type', 'application/json')
              req.setHeader('X-Requested-With', 'XMLHttpRequest')
            })
          },
        },
        [tokenProxyPath]: {
          target: tokenTarget,
          changeOrigin: true,
          secure: true,
          rewrite: () => tokenPathname,
          headers: { accept: 'application/json' },
          configure: (proxy) => {
            proxy.on('proxyReq', (req) => {
              if ('origin' in req.getHeaders()) req.removeHeader('origin')
              req.setHeader('accept', 'application/json')
              req.setHeader('content-type', 'application/x-www-form-urlencoded')
            })
          },
        },
      },
    },
  }
})
