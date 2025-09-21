"use client";

import { useState, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Star, ChevronDown, FileText } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const HeaderClient = () => {
  const [mounted, setMounted] = useState(false);
  const { isLoaded } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded) {
    // Return a placeholder during SSR and while Clerk is loading
    return (
      <div className="flex items-center gap-4">
        <div className="w-20 h-10 bg-muted animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <SignedIn>
        {/* Growth Tools Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex items-center gap-1">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden md:inline ml-1">Growth Tools</span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link href="/resume" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Build Resume</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href={"/ai-cover-letter"}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                <span>Cover Letter</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href={"/interview"}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                <span>Interview Prep</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Industry Insights Button */}
        <Link href="/dashboard">
          <Button variant="outline">
            <Star className="h-4 w-4" />
            <span className="hidden md:inline ml-1">Industry Insights</span>
          </Button>
        </Link>
      </SignedIn>

      {/* Auth Buttons */}
      <SignedOut>
        <SignInButton>
          <Button variant="outline">Sign In</Button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-10 h-10",
              userButtonPopoverCard: "shadow-xl",
              userPreviewMainIdentifier: "font-semibold",
            },
          }}
          afterSignOutUrl=""
        />
      </SignedIn>
    </div>
  );
};

export default HeaderClient;
