// apollo.ts
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, from, fromPromise } from '@apollo/client'
import { onError } from '@apollo/client/link/error'

let accessToken: string | null =
  sessionStorage.getItem('bearer_token') ||
  (import.meta.env.VITE_BEARER as string | undefined) ||
  null

let isRefreshing = false
let pendingResolvers: Array<(t: string) => void> = []

function enqueuePending(resolve: (t: string) => void) { pendingResolvers.push(resolve) }
function resolveAllPending(token: string) { pendingResolvers.forEach((r) => r(token)); pendingResolvers = [] }

async function fetchNewToken(): Promise<string> {
  const url = import.meta.env.VITE_AAD_TOKEN_PROXY as string
  const clientId = import.meta.env.VITE_AAD_CLIENT_ID as string
  const clientSecret = import.meta.env.VITE_AAD_CLIENT_SECRET as string
  const resource = import.meta.env.VITE_AAD_RESOURCE as string

  const body = new URLSearchParams()
  body.set('grant_type', 'client_credentials')
  body.set('client_id', clientId)
  body.set('client_secret', clientSecret)
  body.set('resource', resource)

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json' },
    body: body.toString(),
    credentials: 'omit',
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    console.error('AAD token error', res.status, text)
    throw new Error(`Token HTTP ${res.status}: ${text}`)
  }
  const json = await res.json()
  const token = (json.access_token as string) || ''
  if (!token) throw new Error('No access_token in response')
  accessToken = token
  sessionStorage.setItem('bearer_token', token)
  return token
}

// 👉 Neu: tokenLink – holt bei Bedarf VOR dem Request ein Token
const tokenLink = new ApolloLink((operation, forward) => {
  return fromPromise(
    (async () => {
      if (accessToken) return accessToken
      // Erster Request im frischen Tab -> Token holen
      return await fetchNewToken()
    })()
  ).flatMap(() => {
    operation.setContext(({ headers = {} }) => ({
      headers: { ...headers, ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}) },
      fetchOptions: { credentials: 'omit' as const },
    }))
    return forward(operation)
  })
})

// 👉 Erweitert: 401 **und** 403 sowie GraphQL "UNAUTHENTICATED" triggern Refresh
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  const unauthenticatedGql = graphQLErrors?.some(e => (e.extensions as any)?.code === 'UNAUTHENTICATED')
  const status = (networkError as any)?.statusCode ?? (networkError as any)?.status ?? null
  const shouldRefresh = unauthenticatedGql || status === 401 || status === 403

  if (!shouldRefresh) return

  if (!isRefreshing) {
    isRefreshing = true
    return fromPromise(
      fetchNewToken()
        .then((t) => { isRefreshing = false; resolveAllPending(t); return t })
        .catch((e) => { isRefreshing = false; resolveAllPending(''); throw e })
    ).flatMap(() => {
      operation.setContext(({ headers = {} }) => ({
        headers: { ...headers, ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}) },
      }))
      return forward(operation)
    })
  }

  return fromPromise(new Promise<string>((resolve) => enqueuePending(resolve))).flatMap(() => {
    operation.setContext(({ headers = {} }) => ({
      headers: { ...headers, ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}) },
    }))
    return forward(operation)
  })
})

const http = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL as string, // "/graphql"
  fetchOptions: { credentials: 'omit' },
  headers: { accept: 'application/json' },
})

// Wichtig: Reihenfolge – erst errorLink, dann tokenLink, dann http
export const apollo = new ApolloClient({
  link: from([errorLink, tokenLink, http]),
  cache: new InMemoryCache(),
})
