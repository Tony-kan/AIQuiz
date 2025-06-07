// // import { NextResponse } from "next/server";
// // import type { NextRequest } from "next/server";
// // import jwt from "jsonwebtoken";
// // // import { jwtVerify } from 'jose';

// // // Define a type for our JWT payload for type safety
// // interface UserJwtPayload {
// //   userId: string;
// //   email: string;
// //   role: "Student" | "Admin";
// // }

// // // The JWT_SECRET must be converted to a Uint8Array for jose
// // // const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET as string);

// // export async function middleware(request: NextRequest) {
// //   const { pathname } = request.nextUrl;
// //   const token = request.cookies.get("token")?.value;

// //   // Define which routes are protected and which are for admins only
// //   const protectedRoutes = ["/dashboard", "/admin"];
// //   const adminOnlyRoutes = ["/admin"];

// //   const isAccessingProtectedRoute = protectedRoutes.some((route) =>
// //     pathname.startsWith(route)
// //   );
// //   const isAccessingAdminRoute = adminOnlyRoutes.some((route) =>
// //     pathname.startsWith(route)
// //   );

// //   // Rule 1: If trying to access a protected route without a token, redirect to sign-in
// //   if (isAccessingProtectedRoute && !token) {
// //     return NextResponse.redirect(new URL("/sign-in", request.url));
// //   }

// //   if (token) {
// //     try {
// //       // Rule 2: Verify the token
// //       //   const { payload } = await jwt.verify(token, JWT_SECRET);
// //       const payload = jwt.verify(token, process.env.JWT_SECRET!);
// //       const userRole = payload.role;

// //       // Rule 3: If a non-admin tries to access an admin route, redirect them
// //       if (isAccessingAdminRoute && userRole !== "Admin") {
// //         // Redirect to their default dashboard
// //         return NextResponse.redirect(new URL("/dashboard", request.url));
// //       }

// //       // Rule 4: If a logged-in user tries to access sign-in/sign-up, redirect them away
// //       if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
// //         return NextResponse.redirect(new URL("/dashboard", request.url));
// //       }
// //     } catch (error) {
// //       // Rule 5: If token is invalid, redirect to sign-in and delete the bad cookie
// //       const response = NextResponse.redirect(new URL("/sign-in", request.url));
// //       response.cookies.delete("token");
// //       return response;
// //     }
// //   }

// //   // If none of the rules match, allow the request to continue
// //   return NextResponse.next();
// // }

// // // Configure the matcher to specify which routes the middleware runs on
// // export const config = {
// //   matcher: [
// //     // Match all paths except for static files and API routes
// //     "/((?!api|_next/static|_next/image|favicon.ico).*)",
// //   ],
// // };

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// // 1. Import 'jose' for JWT verification in the Edge Runtime
// import { jwtVerify } from "jose";

// // Define a type for our JWT payload for type safety
// interface UserJwtPayload {
//   userId: string;
//   email: string;
//   role: "Student" | "Admin";
//   // 'iat' and 'exp' are standard JWT claims, including them is good practice
//   iat: number;
//   exp: number;
// }

// // 2. The JWT_SECRET must be converted to a Uint8Array for 'jose'
// const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET as string);

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const token = request.cookies.get("token")?.value;

//   // Your routing logic is perfect, no changes needed here
//   const protectedRoutes = ["/dashboard", "/admin"];
//   const adminOnlyRoutes = ["/dashboard"];

//   const isAccessingProtectedRoute = protectedRoutes.some((route) =>
//     pathname.startsWith(route)
//   );
//   const isAccessingAdminRoute = adminOnlyRoutes.some((route) =>
//     pathname.startsWith(route)
//   );

//   // Rule 1: If trying to access a protected route without a token, redirect to sign-in
//   if (isAccessingProtectedRoute && !token) {
//     return NextResponse.redirect(new URL("/sign-in", request.url));
//   }

//   if (token) {
//     try {
//       // 3. Use 'jwtVerify' from 'jose' to verify the token.
//       //    The generic <UserJwtPayload> provides full type safety for the payload.
//       const { payload } = await jwtVerify<UserJwtPayload>(token, JWT_SECRET);
//       const userRole = payload.role;

//       // Rule 3: If a non-admin tries to access an admin route, redirect them
//       if (isAccessingAdminRoute && userRole !== "Admin") {
//         return NextResponse.redirect(new URL("/dashboard", request.url));
//       }

//       // Rule 4: If a logged-in user tries to access sign-in/sign-up, redirect them away
//       if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
//         return NextResponse.redirect(new URL("/dashboard", request.url));
//       }
//     } catch (error) {
//       // Rule 5: If token is invalid (expired, malformed, etc.), redirect to sign-in
//       // and delete the bad cookie.
//       console.error("JWT Verification Error:", error);
//       const response = NextResponse.redirect(new URL("/sign-in", request.url));
//       response.cookies.delete("token");
//       return response;
//     }
//   }

//   // If none of the rules match, allow the request to continue
//   return NextResponse.next();
// }

// // Your matcher config is perfect, no changes needed
// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Define a type for our JWT payload for type safety
interface UserJwtPayload {
  userId: string;
  email: string;
  role: "Student" | "Admin";
  iat: number;
  exp: number;
}

// The JWT_SECRET must be converted to a Uint8Array for 'jose'
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET as string);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // 1. Define your role-specific routes clearly
  const adminRoutes = ["/dashboard", "/quizzes", "/students"];
  const studentRoutes = ["/studentDashboard", "/studentQuizzez", "/results"];
  const allProtectedRoutes = [...adminRoutes, ...studentRoutes];

  // 2. Create boolean flags to check the current path
  const isAccessingAdminRoute = adminRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAccessingStudentRoute = studentRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAccessingAnyProtectedRoute = allProtectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // --- RULE 1: Handle users without a token ---
  // If trying to access ANY protected route without a token, redirect to sign-in
  if (isAccessingAnyProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // --- RULE 2: Handle users WITH a token ---
  if (token) {
    try {
      const { payload } = await jwtVerify<UserJwtPayload>(token, JWT_SECRET);
      const userRole = payload.role;

      // --- Sub-rule 2a: Role-based access control ---
      // If a Student tries to access an Admin-only route...
      if (userRole === "Student" && isAccessingAdminRoute) {
        // ...redirect them to their own dashboard.
        return NextResponse.redirect(new URL("/studentDashboard", request.url));
      }

      // If an Admin tries to access a Student-only route...
      if (userRole === "Admin" && isAccessingStudentRoute) {
        // ...redirect them to their own dashboard.
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // --- Sub-rule 2b: Prevent access to auth pages when logged in ---
      if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
        // Redirect to the appropriate dashboard based on their role
        const dashboardUrl =
          userRole === "Admin" ? "/dashboard" : "/studentDashboard";
        return NextResponse.redirect(new URL(dashboardUrl, request.url));
      }
    } catch (error) {
      // --- Sub-rule 2c: Handle invalid/expired tokens ---
      // If the token is invalid, redirect to sign-in and clear the bad cookie.
      console.error("JWT Verification Error:", error);
      const response = NextResponse.redirect(new URL("/sign-in", request.url));
      response.cookies.delete("token");
      return response;
    }
  }

  // --- RULE 3: If none of the above rules match, allow the request ---
  return NextResponse.next();
}

// Your matcher config is perfect, no changes needed
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
