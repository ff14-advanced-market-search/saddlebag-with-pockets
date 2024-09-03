import { defaultMaxAge } from '~/requests/client/config'

export function setCookie(
  name: string,
  value: string,
  options: { maxAge?: number; path?: string } = {}
) {
  const { maxAge = defaultMaxAge, path = '/' } = options
  return `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=${path}; HttpOnly; Secure; SameSite=Lax`
}
