import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";

const Navbar = ({ isDefaultPage, onGoogleLogin, onSignInClick }) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push("/"); // Redirect to the default homepage after logout
    };

    return (
        <div className="bg-gray-800">
            <div className="h-16 px-5 flex items-center justify-between">
                <p className="text-white font-bold">IRM Management System</p>
                <div className="flex items-center space-x-4">
                    {isDefaultPage ? (
                        // Social login and Sign In buttons for the default page
                        <>
                            <button
                                onClick={onSignInClick}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
                            >
                                Affiliate Member
                            </button>
                            <button
                                onClick={onGoogleLogin}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold"
                            >
                                Admin
                            </button>

                        </>
                    ) : session ? (
                        // Admin or affiliate functionality
                        <>
                            <Image
                                onClick={handleLogout}
                                className="rounded-full cursor-pointer"
                                src={session.user.image || "/default-avatar.png"}
                                height={30}
                                width={30}
                                alt="User Profile"
                                title="Click to Logout"
                            />
                            <p className="text-white font-bold">{session?.user.name}</p>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
