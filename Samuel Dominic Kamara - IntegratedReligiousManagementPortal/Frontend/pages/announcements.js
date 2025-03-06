import React, { useState } from "react";
import Layout from "../components/Layout";
import AddAnnouncement from "../components/AddAnnouncement";
import AnnouncementList from "../components/AnnouncementList";

const Announcements = () => {
    const [newAnnouncement, setNewAnnouncement] = useState(null);

    // Callback to update the announcement list when a new announcement is added
    const handleNewAnnouncement = (announcement) => {
        setNewAnnouncement(announcement);
    };

    return (
        <Layout>
            <div className="p-8 bg-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Announcements</h2>
                    <AddAnnouncement onNewAnnouncement={handleNewAnnouncement} />
                </div>
                <AnnouncementList announcement={newAnnouncement} />
            </div>
        </Layout>
    );
};

export default Announcements;
