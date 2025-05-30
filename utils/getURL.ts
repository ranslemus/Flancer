export function getURL() {
  let url =
    process?.env?.NEXT_PUBLIC_SUPABASE_URL ?? // Environment variable (e.g. for production)
    process?.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? // Automatically set by Vercel
    'http://localhost:3000/' // Fallback for local dev

  // Ensure it starts with https:// and ends with /
  url = url.includes('http') ? url : `https://${url}`
  if (!url.endsWith('/')) url += '/'
  
  return url
}
