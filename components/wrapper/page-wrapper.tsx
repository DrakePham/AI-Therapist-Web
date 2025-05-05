// "use client";
// import { api } from '@/convex/_generated/api';
// import { useUser } from '@auth0/nextjs-auth0/client';
// import { useMutation, useQuery } from 'convex/react';
// import { useEffect, useState } from 'react';
// import Footer from './footer';
// import NavBar from './navbar';

// // Định nghĩa kiểu cho user từ Auth0
// interface Auth0User {
//   name?: string;
//   nickname?: string;
//   email?: string;
//   sub?: string;
// }

// export default function PageWrapper({ children }: { children: React.ReactNode }) {
//   const { user: rawUser, isLoading: authLoading, error: authError } = useUser();
//   const user = rawUser as Auth0User | undefined;
//   const isAuthenticated = !!user;

//   // Kiểm tra lỗi từ Auth0
//   if (authError) {
//     console.error("Auth0 error:", authError);
//     return <div>Error: Failed to authenticate with Auth0</div>;
//   }

//   // Lấy thông tin user từ Convex
//   const userData = useQuery(api.users.getUser, isAuthenticated ? undefined : "skip");
//   const storeUser = useMutation(api.users.store);

//   // Trạng thái để kiểm soát việc gọi storeUser
//   const [hasStoredUser, setHasStoredUser] = useState(false);

//   useEffect(() => {
//     // Chỉ lưu user nếu đã đăng nhập, chưa lưu trước đó, và userData chưa tồn tại
//     if (isAuthenticated && user && !hasStoredUser && userData === null) {
//       // Kiểm tra dữ liệu user từ Auth0
//       if (!user.sub) {
//         console.error("User data is incomplete:", user);
//         return;
//       }

//       const store = async () => {
//         try {
//           await storeUser({
//             name: user.name || user.nickname || "Unknown",
//             email: user.email || "",
//             auth0Id: user.sub,
//           });
//           setHasStoredUser(true);
//         } catch (error) {
//           console.error("Error storing user:", error);
//         }
//       };
//       store();
//     }
//   }, [isAuthenticated, user, userData, storeUser, hasStoredUser]);

//   // Hiển thị loading nếu đang xác thực hoặc lấy dữ liệu
//   if (authLoading || (isAuthenticated && userData === undefined)) {
//     return <div>Loading...</div>;
//   }

//   // Hiển thị lỗi nếu không tải được userData
//   if (isAuthenticated && userData === undefined) {
//     return <div>Error: Failed to load user data from Convex</div>;
//   }

//   return (
//     <>
//       <NavBar />
//       <main className="flex min-h-screen flex-col pt-[4rem] items-center dark:bg-black bg-white justify-between">
//         <div className="absolute z-[-99] pointer-events-none inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
//         {children}
//       </main>
//       <Footer />
//     </>
//   );
// }
"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect } from "react";
import Footer from "./footer";
import NavBar from "./navbar";

// Định nghĩa kiểu cho user từ Auth0
interface Auth0User {
  name?: string;
  nickname?: string;
  email?: string;
  sub?: string;
}

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const { user: rawUser, isLoading: authLoading, error: authError } = useUser();
  const user = rawUser as Auth0User | undefined;
  const isAuthenticated = !!user;

  // Kiểm tra lỗi từ Auth0
  if (authError) {
    console.error("Auth0 error:", authError);
    return <div>Lỗi: Không thể xác thực với Auth0</div>;
  }

  
  // In thông tin user để kiểm tra (tùy chọn)
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("User đã đăng nhập:", user);
    }
  }, [isAuthenticated, user]);

  return (
    <>
      <NavBar />
      <main className="flex min-h-screen flex-col pt-[4rem] items-center dark:bg-black bg-white justify-between">
        <div className="absolute z-[-99] pointer-events-none inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        {children}
      </main>
      <Footer />
    </>
  );
}