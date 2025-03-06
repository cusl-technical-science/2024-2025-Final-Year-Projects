import { getSession } from "next-auth/react";
import Head from "next/head";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Chart from "../components/Chart";
import Navbar from "../components/Navbar";
import Login from "../components/Login";

export default function Home({ session }) {
    const [usersCount, setUsersCount] = useState(0);
    const [eventsCount, setEventsCount] = useState(0);
    const [announcementsCount, setAnnouncementsCount] = useState(0);
    const [subSections, setSubSections] = useState([]); // Subsection data

    // Fetch counts and subsections
    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [usersRes, eventsRes, announcementsRes] = await Promise.all([
                    fetch("http://localhost:8080/api/v1/users/count"),
                    fetch("http://localhost:8080/api/v1/events/count"),
                    fetch("http://localhost:8080/api/v1/announcements/count"),
                ]);

                if (usersRes.ok && eventsRes.ok && announcementsRes.ok) {
                    setUsersCount(await usersRes.json());
                    setEventsCount(await eventsRes.json());
                    setAnnouncementsCount(await announcementsRes.json());
                } else {
                    console.error("Failed to fetch counts.");
                }
            } catch (error) {
                console.error("Error fetching counts:", error);
            }
        };

        const fetchSubSections = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/v1/users/subsections");
                if (response.ok) {
                    setSubSections(await response.json());
                } else {
                    console.error("Failed to fetch subsections.");
                }
            } catch (error) {
                console.error("Error fetching subsections:", error);
            }
        };

        fetchCounts();
        fetchSubSections();
    }, []);

    const handleNewSubSection = (newSubSection) => {
        // Dynamically update the subsections when a new one is added
        setSubSections((prev) => [newSubSection, ...prev]);
    };

    if (!session) return <Login />;

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Head>
                <title>IRM Management Dashboard</title>
            </Head>

            <Sidebar />

            <div className="flex-1 ml-64 p-6">
                <Navbar />

                <main className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Chart title="Users" count={usersCount} color="rgba(75, 192, 192, 0.5)" />
                        <Chart title="Announcements" count={announcementsCount} color="rgba(255, 206, 86, 0.5)" />
                        <Chart title="Events" count={eventsCount} color="rgba(54, 162, 235, 0.5)" />
                    </div>

                    <h3 className="text-xl font-bold mb-4">Registered Subsections</h3>
                    {subSections.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {subSections.map((subSection) => (
                                <div
                                    key={subSection.id}
                                    className="p-4 border rounded-lg shadow-md bg-gray-50"
                                >
                                    <h4 className="text-lg font-semibold text-gray-800">
                                        {subSection.churchOrMosqueName}
                                    </h4>
                                    <p className="text-gray-700">
                                        <strong>Location:</strong> {subSection.city}, {subSection.state}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Contact Person:</strong> {subSection.contactPerson} ({subSection.role})
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Phone:</strong> {subSection.phoneNumber}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Email:</strong> {subSection.email}
                                    </p>
                                    <p className="text-gray-700">
                                        <strong>Members:</strong> {subSection.numberOfMembers}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">No registered subsections to display.</p>
                    )}
                </main>
            </div>
        </div>
    );
}

export async function getServerSideProps(context) {
    const session = await getSession(context);
    return { props: { session } };
}
