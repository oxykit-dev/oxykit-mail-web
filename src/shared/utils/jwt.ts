import { jwtDecode } from 'jwt-decode'

export function getUserIdFromToken(token: string | null): string | null {
  if (!token) return null
  try {
    const decoded = jwtDecode<Record<string, unknown>>(token)
    // Try both standard and Microsoft/ASP.NET claim types
    return (
      (typeof decoded.sub === 'string' && decoded.sub) ||
      (typeof decoded.nameid === 'string' && decoded.nameid) ||
      (typeof decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ===
        'string' &&
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']) ||
      null
    )
  } catch {
    return null
  }
}
