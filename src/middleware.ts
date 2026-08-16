import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import getOrCreateDB from './models/server/dbSetup'
import getOrCreateStorage from './models/server/storageSetup'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  
  try {
    await Promise.all([
      getOrCreateDB(),
      getOrCreateStorage()
    ])
  } catch (error) {
    // Log the error but don't fail the request
    console.log('Middleware setup error (non-critical):', error instanceof Error ? error.message : String(error))
  }
  
  return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  /* match all request paths except for the the ones that starts with:
  - api
  - _next/static
  - _next/image
  - favicon.ico

  */
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}