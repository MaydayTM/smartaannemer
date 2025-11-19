/**
 * Generate a secure session token
 */
export default function generateSessionToken(): string {
  const timestamp = String(Date.now())
  const random = String(Math.random()).slice(2, 15)
  return 'sess_' + timestamp + '_' + random
}
