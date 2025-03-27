import { SignedIn, SignedOut, SignOutButton, UserButton, useUser } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom"; // Fix import path
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

const Topbar = () => {
    const { isAdmin, checkAdminStatus } = useAuthStore();
    const { user } = useUser(); // Destructure `user` properly

    useEffect(() => {
        if (user?.primaryEmailAddress?.emailAddress) {
            checkAdminStatus(user.primaryEmailAddress.emailAddress);
        }
    }, [user?.primaryEmailAddress?.emailAddress, checkAdminStatus]); // Add dependencies

    return (
        <div className="flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-md z-10">
            <div className="flex gap-2 items-center">
                <img src="/spotify.png" className="size-8" alt="spotify" />
                Spotify
            </div>
            <div className="flex items-center gap-4">
                {isAdmin && (
                    <Link to={"/admin"} className={cn(buttonVariants({ variant: "outline" }))}>
                    <LayoutDashboardIcon className='size-4  mr-2' />
                    Admin Dashboard
                </Link>
                )}

                <SignedIn>
                    <SignOutButton />
                </SignedIn>

                <SignedOut>
                    <SignInOAuthButtons />
                </SignedOut>

                <UserButton />
            </div>
        </div>
    );
};

export default Topbar;
