"use client";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
    LogOut,
    Settings,
    Sparkles,
    User
} from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

// Định nghĩa kiểu cho user từ Auth0
interface Auth0User {
  name?: string;
  email?: string;
  picture?: string | null; // picture có thể là null
  sub?: string;
}

export function UserProfile() {
  const { user: rawUser, isLoading } = useUser();
  const user = rawUser as Auth0User | undefined; // Ép kiểu mà không dùng generic

  // Nếu đang tải, hiển thị placeholder
  if (isLoading) {
    return (
      <Button variant="ghost" className="relative h-9 w-9 rounded-full">
        <Avatar className="h-9 w-9 rounded-full ring-1 ring-border">
          <AvatarFallback className="bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-200">
            ...
          </AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  // Nếu chưa đăng nhập, hiển thị nút Log in
  if (!user) {
    return (
      <Link href="/api/auth/login">
        <Button variant="outline">Log in</Button>
      </Link>
    );
  }

  // Tách firstName và lastName từ user.name (nếu có)
  const nameParts = user.name?.split(" ") || [];
  const firstName = nameParts[0] || "";
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9 rounded-full ring-1 ring-border">
            <AvatarImage src={user.picture ?? undefined} alt={user.name || "User Profile"} />
            <AvatarFallback className="bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-200">
              {firstName?.[0]}
              {lastName?.[0]}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/user-profile">
            <DropdownMenuItem className="focus:bg-blue-50 dark:focus:bg-blue-950">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/dashboard/settings">
            <DropdownMenuItem className="focus:bg-blue-50 dark:focus:bg-blue-950">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/#pricing">
            <DropdownMenuItem className="focus:bg-blue-50 dark:focus:bg-blue-950">
              <Sparkles className="mr-2 h-4 w-4" />
              <span>Upgrade Plan</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <Link href="/api/auth/logout">
          <DropdownMenuItem className="focus:bg-blue-50 dark:focus:bg-blue-950">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}