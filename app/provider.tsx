// "use client";
// import { useUser } from "@auth0/nextjs-auth0/client";
// import { ConvexReactClient } from "convex/react";
// import { ConvexProviderWithAuth } from "convex/react";
// import { ReactNode, useEffect, useState } from "react";
// import { createAuth0Client } from "@auth0/auth0-spa-js";

// // Khởi tạo Auth0 client
// const getAuth0Client = async () => {
//   return await createAuth0Client({
//     domain: process.env.NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL!.replace("https://", ""),
//     clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!,
//     authorizationParams: {
//       audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
//       scope: process.env.NEXT_PUBLIC_AUTH0_SCOPE,
//     },
//   });
// };

// export default function Provider({ children }: { children: ReactNode }) {
//   const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
//   const { user, isLoading } = useUser();
//   const [auth0Client, setAuth0Client] = useState<any>(null);

//   // Khởi tạo Auth0 client khi component mount
//   useEffect(() => {
//     const initAuth0 = async () => {
//       const client = await getAuth0Client();
//       setAuth0Client(client);
//     };
//     initAuth0();
//   }, []);

//   // Hàm lấy access token từ Auth0
//   const getAccessToken = async () => {
//     if (!auth0Client || !user) return null;
//     try {
//       const token = await auth0Client.getTokenSilently();
//       return token || null;
//     } catch (error) {
//       console.error("Error fetching access token:", error);
//       return null;
//     }
//   };

//   // Định nghĩa useAuth để cung cấp cho Convex
//   const useAuth = () => ({
//     isLoading: isLoading || !auth0Client, // Đợi cả Auth0 client và user
//     isAuthenticated: !!user,
//     getToken: getAccessToken,
//   });

//   return (
//     <ConvexProviderWithAuth client={convex} useAuth={useAuth}>
//       {children}
//     </ConvexProviderWithAuth>
//   );
// }

"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithAuth } from "convex/react";
import { ReactNode, useEffect, useState } from "react";
import { createAuth0Client, Auth0Client } from "@auth0/auth0-spa-js";

//const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function Provider({ children }: { children: ReactNode }) {
  const { user, isLoading } = useUser();
  const [auth0Client, setAuth0Client] = useState<Auth0Client | null>(null);

  // Khởi tạo Auth0 client một lần
  useEffect(() => {
    const initAuth0 = async () => {
      const client = await createAuth0Client({
        domain: process.env.NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL!.replace("https://", ""),
        clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!,
        authorizationParams: {
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
          scope: process.env.NEXT_PUBLIC_AUTH0_SCOPE,
        },
      });
      setAuth0Client(client);
    };
    initAuth0();
  }, []);

  // useAuth theo đúng yêu cầu của Convex
  const useAuth = () => ({
    isLoading: isLoading || !auth0Client,
    isAuthenticated: !!user,
    fetchAccessToken: async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      if (!auth0Client || !user) return null;
      try {
        const token = await auth0Client.getTokenSilently({
          cacheMode: forceRefreshToken ? "off" : "on",
        });
        return token || null;
      } catch (err) {
        console.error("Error getting access token", err);
        return null;
      }
    },
  });

  // return (
  //   <ConvexProviderWithAuth client={convex} useAuth={useAuth}>
  //     {children}
  //   </ConvexProviderWithAuth>
  // );
}
