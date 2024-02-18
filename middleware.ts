import { authMiddleware } from "@clerk/nextjs";




// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware


// ASLI
// export default authMiddleware({
//   publicRoutes: ["/api/:path*"]
// });


export default authMiddleware({
  publicRoutes: ["/api/:path*"]
});


// TESTING
// export default authMiddleware({ publicRoutes: ['/', '/api/webhook/clerk'], ignoredRoutes: ['/api/webhook/clerk'], });


// Testing lagi
// export default authMiddleware({
//   debug: true,
  
//   // An array of public routes that don't require authentication.
//   publicRoutes: ['/', '/api/webhook/clerk'],
  
//   // An array of routes to be ignored by the authentication middleware.
//   ignoredRoutes: ['/api/webhook/clerk'],
//   });
// export default authMiddleware({
//   publicRoutes: ["/sign-in"],
//   ignoredRoutes: ["/((?!api|trpc))(_next.*|.+\.[\w]+$)", "/sign-in"]
// });

 
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
 