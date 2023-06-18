import { useUser } from "@auth0/nextjs-auth0/client";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

function Header() {
    const session = useUser();
    const user = session.user;
    if (session.error) return <div>{session.error.message}</div>;
    

    return (
        <header className="shadow bg-white items-center p-2 mt-1 rounded    flex justify-between">
            <section className="text-sm flex gap-2">
                <Profile />
            </section>
            {user
                ? (
                    <Button variant="destructive" size="sm" asChild>
                        <Link href="/api/auth/logout">
                            Logout
                        </Link>
                    </Button>
                )
                : (
                    <Button variant="secondary" size="sm" asChild>
                        <Link href="/api/auth/login">
                            Login
                        </Link>
                    </Button>
                )}
        </header>
    );
}

const Profile = () => {
    const session = useUser();
    const user = session?.user;
    if (!user) return null;
    return (
        <div className="flex items-center gap-2">
            {user.picture &&
                (
                    <Image
                        width={35}
                        height={35}
                        className="rounded-full"
                        src={user.picture}
                        alt="profile-pic"
                    />
                )}
            <div>
                <div>
                    {session.user?.email}
                </div>
            </div>
        </div>
    );
};

export default Header;
