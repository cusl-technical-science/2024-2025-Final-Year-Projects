import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import RegistrationForm from "./RegistrationForm";

const AffiliateNavbar = ({ onEditProfileClick, section, onNewSubSection }) => {
    const router = useRouter();
    const [showRegistrationForm, setShowRegistrationForm] = useState(false);
    const [userId, setUserId] = useState(null);

    const handleLogout = async () => {
        try {
            // Clear local storage data
            localStorage.removeItem("email");
            localStorage.removeItem("token"); // Assuming token exists for session management

            // Log out user using next-auth
            await signOut({ redirect: false });

            // Redirect to the default homepage
            router.push("/");
        } catch (error) {
            console.error("Error during logout:", error);
            alert("Failed to log out. Please try again.");
        }
    };

    useEffect(() => {
        const fetchUserId = async () => {
            const email = localStorage.getItem("email");
            if (!email) {
                console.error("Email is not available in localStorage.");
                return;
            }

            try {
                const response = await fetch(
                    `http://localhost:8080/api/v1/users/profile/${email}`
                );
                if (response.ok) {
                    const data = await response.json();
                    setUserId(data.id); // Set userId from profile
                } else {
                    console.error("Failed to fetch user ID.");
                }
            } catch (error) {
                console.error("Error fetching user ID:", error);
            }
        };

        fetchUserId();
    }, []);

    return (
        <>
            <div className="bg-gray-800">
                <div className="h-16 px-5 flex items-center justify-between">
                    <p
                        className="text-white font-bold cursor-pointer"
                        onClick={() => router.push("/")} // Navigate to homepage/dashboard
                    >
                        IRM Management System
                    </p>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={onEditProfileClick}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold"
                        >
                            Edit Profile
                        </button>
                        <button
                            onClick={() => setShowRegistrationForm(true)}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold"
                        >
                            Register Church/Mosque
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
            {showRegistrationForm && userId && (
                <RegistrationForm
                    section={section} // Pass section from props
                    userId={userId} // Pass fetched userId
                    closeForm={() => setShowRegistrationForm(false)} // Close handler
                    onNewSubSection={onNewSubSection} // Notify parent of new subsection
                />
            )}
        </>
    );
};

export default AffiliateNavbar;
