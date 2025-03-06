import React, { useEffect, useState } from "react";
import AffiliateNavbar from "../components/AffiliateNavbar";
import Chart from "../components/Chart";
import EditAffiliateProfile from "../components/EditAffiliateProfile";
import RegistrationForm from "../components/RegistrationForm";

const AffiliateDashboard = () => {
    const [profile, setProfile] = useState({});
    const [chartData, setChartData] = useState({ announcements: 0, events: 0 });
    const [announcements, setAnnouncements] = useState([]);
    const [events, setEvents] = useState([]);
    const [subSections, setSubSections] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingSubSection, setEditingSubSection] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const email = localStorage.getItem("email");
            if (!email) {
                console.error("Email is not available in localStorage.");
                return;
            }

            try {
                const response = await fetch(`http://localhost:8080/api/v1/users/profile/${email}`);
                if (response.ok) {
                    const data = await response.json();
                    setProfile(data);
                } else {
                    console.error("Failed to fetch profile.");
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        const fetchCounts = async () => {
            try {
                const [announcementsRes, eventsRes] = await Promise.all([
                    fetch("http://localhost:8080/api/v1/announcements/count"),
                    fetch("http://localhost:8080/api/v1/events/count"),
                ]);

                if (announcementsRes.ok && eventsRes.ok) {
                    setChartData({
                        announcements: await announcementsRes.json(),
                        events: await eventsRes.json(),
                    });
                } else {
                    console.error("Failed to fetch counts.");
                }
            } catch (error) {
                console.error("Error fetching counts:", error);
            }
        };

        const fetchAnnouncements = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/v1/announcements");
                if (response.ok) {
                    const data = await response.json();
                    setAnnouncements(data);
                } else {
                    console.error("Failed to fetch announcements.");
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
                    console.error("Failed to fetch events.");
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        const fetchSubSections = async () => {
            if (!profile.id) return;
            try {
                const response = await fetch(`http://localhost:8080/api/v1/users/${profile.id}/subsections`);
                if (response.ok) {
                    const data = await response.json();
                    setSubSections(data);
                } else {
                    console.error("Failed to fetch subsections.");
                }
            } catch (error) {
                console.error("Error fetching subsections:", error);
            }
        };

        fetchProfile();
        fetchCounts();
        fetchAnnouncements();
        fetchEvents();
        fetchSubSections();
    }, [profile.id]);

    const handleNewSubSection = (newSubSection) => {
        setSubSections((prevSubSections) => [...prevSubSections, newSubSection]);
    };

    const handleEditSubSection = (updatedSubSection) => {
        setSubSections((prevSubSections) =>
            prevSubSections.map((subSection) =>
                subSection.id === updatedSubSection.id ? updatedSubSection : subSection
            )
        );
        setEditingSubSection(null);
    };

    const handleDeleteSubSection = async (subSectionId) => {
        if (confirm("Are you sure you want to delete this subsection?")) {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/users/subsections/${subSectionId}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    setSubSections((prevSubSections) =>
                        prevSubSections.filter((subSection) => subSection.id !== subSectionId)
                    );
                    alert("Subsection deleted successfully.");
                } else {
                    alert("Failed to delete subsection.");
                }
            } catch (error) {
                alert("Error deleting subsection: " + error.message);
            }
        }
    };

    return (
        <div>


            <AffiliateNavbar
                profileData={profile}
                onEditProfileClick={() => setShowEditModal(true)}
                onNewSubSection={handleNewSubSection} // Pass the handler to AffiliateNavbar
                section={profile.section}
            />

            <div className="max-w-7xl mx-auto mt-8">
                <h2 className="text-2xl font-bold mb-4">Affiliate Dashboard</h2>
                <div className="grid grid-cols-2 gap-6">
                    <Chart title="Announcements" count={chartData.announcements} color="rgba(255, 206, 86, 0.5)" />
                    <Chart title="Events" count={chartData.events} color="rgba(54, 162, 235, 0.5)" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">Announcements</h3>
                        {announcements.length > 0 ? (
                            <ul className="space-y-4">
                                {announcements.map((announcement) => (
                                    <li key={announcement.id} className="p-4 border rounded-lg shadow-md bg-yellow-50">
                                        <h4 className="text-lg font-semibold text-yellow-800">{announcement.title}</h4>
                                        <p className="text-gray-700">{announcement.description}</p>
                                        <p className="text-gray-500 text-sm">
                                            {new Date(announcement.date).toLocaleDateString()}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-600">No announcements to display.</p>
                        )}
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4">Events</h3>
                        {events.length > 0 ? (
                            <ul className="space-y-4">
                                {events.map((event) => (
                                    <li key={event.id} className="p-4 border rounded-lg shadow-md bg-blue-50">
                                        <h4 className="text-lg font-semibold text-blue-800">{event.title}</h4>
                                        <p className="text-gray-700">{event.description}</p>
                                        <p className="text-gray-500 text-sm">
                                            Date: {new Date(event.date).toLocaleDateString()} | Location: {event.location}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-600">No events to display.</p>
                        )}
                    </div>
                </div>

                <div className="mt-12">
                    <h3 className="text-xl font-bold mb-4">Registered Subsections</h3>
                    {subSections.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {subSections.map((subSection) => (
                                <div key={subSection.id} className="p-4 border rounded-lg shadow-md bg-gray-50">
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
                                    <div className="flex justify-between mt-4">
                                        <button
                                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                            onClick={() => setEditingSubSection(subSection)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-red-500 text-white rounded-md"
                                            onClick={() => handleDeleteSubSection(subSection.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">No subsections to display.</p>
                    )}
                </div>
            </div>

            {showEditModal && (
                <EditAffiliateProfile
                    userId={profile?.id}
                    updateProfileData={(updatedProfile) => setProfile(updatedProfile)}
                    closeEdit={() => setShowEditModal(false)}
                />
            )}

            {editingSubSection && (
                <RegistrationForm
                    section={editingSubSection.section}
                    userId={profile.id}
                    closeForm={() => setEditingSubSection(null)}
                    onNewSubSection={handleEditSubSection}
                    editingSubSection={editingSubSection}
                />
            )}
        </div>
    );
};

export default AffiliateDashboard;
