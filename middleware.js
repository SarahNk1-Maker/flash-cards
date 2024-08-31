// Simple test middleware
export default function middleware(req) {
  return new Response('Middleware is working', { status: 200 });
}

// Define configuration for the middleware
export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)', '/(api|trpc)(.*)'],
};
