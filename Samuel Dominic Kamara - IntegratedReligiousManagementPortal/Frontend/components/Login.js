
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const Login = () => {
    const [showSignInModal, setShowSignInModal] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [announcements, setAnnouncements] = useState([]);
    const [events, setEvents] = useState([]);

    const router = useRouter();

    // Fetch announcements and events
    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/v1/announcements");
                if (response.ok) {
                    const data = await response.json();
                    setAnnouncements(data);
                } else {
                    console.error("Failed to fetch announcements");
                }
            } catch (error) {
                console.error("Error fetching announcements:", error);
            }
        };

        const fetchEvents = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/v1/events");
                if (response.ok) {
                    const data = await response.json();
                    setEvents(data);
                } else {
                    console.error("Failed to fetch events");
                }
            } catch (error) {
                console.error("Error fetching events", error);
            }
        };

        fetchAnnouncements();
        fetchEvents();
    }, []);

    // Handle form data change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle affiliate login form submission
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const result = await fetch("http://localhost:8080/api/v1/users/login", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 emailId: formData.email,
    //                 password: formData.password,
    //             }),
    //         });
    //
    //         if (result.ok) {
    //             const data = await result.json();
    //             if (data.role === "Affiliate") {
    //                 router.push("/affiliate-dashboard");
    //             } else {
    //                 alert("You are not authorized to access the affiliate dashboard.");
    //             }
    //         } else {
    //             alert("Invalid credentials. Please try again.");
    //         }
    //     } catch (error) {
    //         console.error("Error during login:", error);
    //         alert("An error occurred while logging in. Please try again later.");
    //     }
    // };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await fetch("http://localhost:8080/api/v1/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    emailId: formData.email,
                    password: formData.password,
                }),
            });

            if (result.ok) {
                const data = await result.json();
                localStorage.setItem("email", formData.email); // Save email to localStorage
                if (data.role === "Affiliate") {
                    router.push("/affiliate-dashboard");
                } else {
                    alert("You are not authorized to access the affiliate dashboard.");
                }
            } else {
                alert("Invalid credentials. Please try again.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred while logging in. Please try again later.");
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <Navbar
                isDefaultPage={true}
                onGoogleLogin={() => signIn("google")}
                onSignInClick={() => setShowSignInModal(true)}
            />

            {/* Header Section */}
            <div className="bg-blue-600 py-8">
                <h1 className="text-4xl text-center text-white font-bold tracking-wide">
                    IRM Management System
                </h1>
            </div>

            {/* Announcements and Events Section */}
            <div className="mt-10 max-w-7xl mx-auto px-6 flex-grow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div
                        className="p-6 rounded-lg shadow-lg"
                        style={{
                            backgroundImage: "url('/path/to/announcement-image.jpg')",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Announcements</h3>
                        <div className="bg-white bg-opacity-80 p-4 rounded-lg">
                            {announcements.length > 0 ? (
                                <ul className="space-y-4">
                                    {announcements.map((announcement) => (
                                        <li
                                            key={announcement.id}
                                            className="p-4 border rounded-lg shadow-lg bg-yellow-100"
                                        >
                                            <h4 className="text-lg font-semibold text-yellow-800">
                                                {announcement.title}
                                            </h4>
                                            <p className="text-gray-700">{announcement.description}</p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(announcement.date).toLocaleDateString()}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-600">No announcements to display.</p>
                            )}
                        </div>
                    </div>

                    <div
                        className="p-6 rounded-lg shadow-lg"
                        style={{
                            backgroundImage: "url('/path/to/event-image.jpg')",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Events</h3>
                        <div className="bg-white bg-opacity-80 p-4 rounded-lg">
                            {events.length > 0 ? (
                                <ul className="space-y-4">
                                    {events.map((event) => (
                                        <li
                                            key={event.id}
                                            className="p-4 border rounded-lg shadow-lg bg-blue-100"
                                        >
                                            <h4 className="text-lg font-semibold text-blue-800">{event.title}</h4>
                                            <p className="text-gray-700">{event.description}</p>
                                            <p className="text-sm text-gray-600">
                                                Date: {new Date(event.date).toLocaleDateString()} | Location:{" "}
                                                {event.location}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-600">No events to display.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <footer className="bg-blue-600 text-white py-6 mt-10">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-center md:text-left text-sm">
                        © {new Date().getFullYear()} IRM Management System. All rights reserved.
                    </p>
                    <ul className="flex space-x-4 mt-4 md:mt-0">
                        <li>
                            <a href="#" className="text-sm hover:underline">
                                Privacy Policy
                            </a>
                        </li>
                        <li>
                            <a href="#" className="text-sm hover:underline">
                                Terms of Service
                            </a>
                        </li>
                        <li>
                            <a href="#" className="text-sm hover:underline">
                                Contact Us
                            </a>
                        </li>
                    </ul>
                </div>
            </footer>

            {/* Sign In Modal */}
            <Transition appear show={showSignInModal} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={() => setShowSignInModal(false)}
                >
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
                        </Transition.Child>
                        <span className="inline-block h-screen align-middle" aria-hidden="true">
                            &#8203;
                        </span>
                        <Transition.Child
                            as="div"
                            className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-lg"
                        >
                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                Affiliate Member Login
                            </Dialog.Title>
                            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="mt-1 p-2 w-full border rounded"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="mt-1 p-2 w-full border rounded"
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>
                                <div className="text-right">
                                    <button
                                        type="button"
                                        onClick={() => setShowSignInModal(false)}
                                        className="bg-gray-400 text-white px-4 py-2 rounded-lg mr-2"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg"
                                    >
                                        Login
                                    </button>
                                </div>
                            </form>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default Login;
