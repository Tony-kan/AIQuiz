// "use client";

// import { useState, useEffect } from "react";
// import { jwtDecode } from "jwt-decode";
// import Cookies from "js-cookie";

// // Define the structure of the data you expect in your JWT payload
// interface Session {
//   userId: string;
//   email: string;
//   fullname: string; // Make sure 'fullname' is in your JWT payload
//   role: "Student" | "Admin";
// }

// export function useSession() {
//   const [session, setSession] = useState<Session | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Try to get the token from the cookies
//     const token = Cookies.get("token");

//     if (token) {
//       try {
//         // Decode the token to get user data
//         const decodedToken: Session = jwtDecode(token);
//         setSession(decodedToken);
//       } catch (error) {
//         console.error("Failed to decode token:", error);
//         // If decoding fails, treat the user as logged out
//         setSession(null);
//         Cookies.remove("token"); // Clean up invalid token
//       }
//     }

//     // We're done checking, so set loading to false
//     setLoading(false);
//   }, []);

//   return { session, loading };
// }

"use client";

import { useState, useEffect } from "react";
// We no longer need js-cookie or jwt-decode here!

// The session data we expect from our new API endpoint
interface Session {
  isAuthenticated: boolean;
  userId?: string;
  email?: string;
  fullname?: string;
  role?: "Student" | "Admin";
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      try {
        // Fetch session data from our new API route
        const response = await fetch("/api/auth/session");
        const data: Session = await response.json();

        if (response.ok && data.isAuthenticated) {
          setSession(data);
        } else {
          setSession(null);
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
        setSession(null);
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, []); // The empty dependency array ensures this runs only once on mount

  return { session, loading };
}
