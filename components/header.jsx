import Image from "next/image";
import Link from "next/link";
import HeaderClient from "@/components/header-client";
import { checkUser } from "@/lib/checkUser";

const Header = async () => {
  try {
    await checkUser();
  } catch (error) {
    console.error('Failed to check user:', error);
    // Continue rendering header even if auth check fails
  }
  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center pt-2">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Sensai Logo"
              width={1200}
              height={600}
              className="h-20 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Right: Buttons + Auth */}
        <HeaderClient />
      </nav>
    </header>
  );
};

export default Header;
