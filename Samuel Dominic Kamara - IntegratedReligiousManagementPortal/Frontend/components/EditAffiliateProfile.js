import React, { useState, useEffect } from "react";

const EditAffiliateProfile = ({ userId, updateProfileData, closeEdit }) => {
    const [profile, setProfile] = useState({
        id: "",
        firstName: "",
        lastName: "",
        emailId: "",
        memberType: "",
        section: "",
        password: "",
    });

    useEffect(() => {
        if (!userId) {
            alert("User ID is undefined. Cannot fetch profile.");
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/users/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setProfile(data);
                } else {
                    alert("Failed to fetch profile data.");
                }
            } catch (error) {
                alert("Error fetching profile: " + error.message);
            }
        };

        fetchProfile();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:8080/api/v1/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(profile),
            });

            if (response.ok) {
                const updatedProfile = await response.json();
                updateProfileData(updatedProfile); // Update parent state
                alert("Profile updated successfully!");
                closeEdit(); // Close the modal/form
            } else {
                alert("Failed to update profile.");
            }
        } catch (error) {
            alert("Error updating profile: " + error.message);
        }
    };

    return (
        <div className="fixed inset-0 z-10 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-medium mb-4">Edit Profile</h3>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-medium mb-1">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={profile?.firstName || ""}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={profile?.lastName || ""}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                name="emailId"
                                value={profile?.emailId || ""}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        {/* Member Type (Disabled) */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Member Type</label>
                            <input
                                type="text"
                                name="memberType"
                                value={profile?.memberType || ""}
                                className="w-full p-2 border rounded-md bg-gray-100"
                                disabled
                            />
                        </div>
                        {/* Section (Disabled) */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Section</label>
                            <input
                                type="text"
                                name="section"
                                value={profile?.section || ""}
                                className="w-full p-2 border rounded-md bg-gray-100"
                                disabled
                            />
                        </div>
                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={profile?.password || ""}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-400 text-white rounded-md"
                            onClick={closeEdit}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAffiliateProfile;
