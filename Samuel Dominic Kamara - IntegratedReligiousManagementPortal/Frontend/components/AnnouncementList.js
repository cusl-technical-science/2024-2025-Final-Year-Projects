import React, { useState, useEffect } from "react";
import EditAnnouncement from "./EditAnnouncement";

const AnnouncementList = ({ announcement }) => {
    const ANNOUNCEMENT_API_BASE_URL = "http://localhost:8080/api/v1/announcements";
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            setLoading(true);
            try {
                const response = await fetch(ANNOUNCEMENT_API_BASE_URL);
                const data = await response.json();
                setAnnouncements(data);
            } catch (error) {
                console.error("Failed to fetch announcements", error);
            }
            setLoading(false);
        };

        fetchAnnouncements();
    }, [announcement]);

    const handleEdit = (id) => {
        setEditingId(id);
    };

    const handleSave = async (updatedAnnouncement) => {
        const response = await fetch(`${ANNOUNCEMENT_API_BASE_URL}/${updatedAnnouncement.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedAnnouncement),
        });

        if (response.ok) {
            setAnnouncements((prev) =>
                prev.map((ann) => (ann.id === updatedAnnouncement.id ? updatedAnnouncement : ann))
            );
            setEditingId(null);
        }
    };

    const handleDelete = async (id) => {
        const response = await fetch(`${ANNOUNCEMENT_API_BASE_URL}/${id}`, {
            method: "DELETE",
        });
        if (response.ok) {
            setAnnouncements((prev) => prev.filter((announcement) => announcement.id !== id));
        }
    };

    return (
        <div className="container mx-auto my-8 max-w-4xl px-4"> {/* Center and set max width */}
            {/*<h2 className="text-xl font-bold">Announcements</h2>*/}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {announcements.map((announcement) => (
                        <li key={announcement.id} className="border p-4 mb-2 flex items-center justify-between">
                            {editingId === announcement.id ? (
                                <EditAnnouncement announcement={announcement} onSave={handleSave} />
                            ) : (
                                <>
                                    <div>
                                        <h3 className="text-lg font-semibold">{announcement.title}</h3>
                                        <p>{announcement.description}</p>
                                        <i><strong>Date:</strong> {announcement.date}</i>
                                    </div>
                                    <div className="ml-auto flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(announcement.id)}
                                            className="bg-yellow-500 text-white p-1 rounded pr-4"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(announcement.id)}
                                            className="bg-red-500 text-white p-1 rounded"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AnnouncementList;
