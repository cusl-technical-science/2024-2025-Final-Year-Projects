
import React, { useState, useEffect } from "react";
import EditEvent from "./EditEvent";

const EventList = ({ event }) => {
    const EVENT_API_BASE_URL = "http://localhost:8080/api/v1/events";
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const response = await fetch(EVENT_API_BASE_URL);
                if (!response.ok) {
                    throw new Error("Failed to fetch events");
                }
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error("Failed to fetch events", error);
            }
            setLoading(false);
        };

        fetchEvents();
    }, [event]);  // Refetch when a new event is added

    const handleEdit = (id) => {
        setEditingId(id);
    };

    const handleSave = async (updatedEvent) => {
        const response = await fetch(`${EVENT_API_BASE_URL}/${updatedEvent.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedEvent),
        });

        if (response.ok) {
            setEvents((prev) =>
                prev.map((evt) => (evt.id === updatedEvent.id ? updatedEvent : evt))
            );
            setEditingId(null);
        }
    };

    const handleDelete = async (id) => {
        const response = await fetch(`${EVENT_API_BASE_URL}/${id}`, {
            method: "DELETE",
        });
        if (response.ok) {
            setEvents((prev) => prev.filter((event) => event.id !== id));
        }
    };

    return (
        <div className="container mx-auto my-8">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {events.map((event) => (
                        <li key={event.id} className="border p-4 mb-2 flex items-center justify-between">
                            {editingId === event.id ? (
                                <EditEvent event={event} onSave={handleSave} />
                            ) : (
                                <>
                                    <div>
                                        <h3 className="text-lg font-semibold">{event.title}</h3>
                                        <p>DESCRIPTION: {event.description}</p>
                                        <p>LOCATION: {event.location}</p>
                                        <i><strong>Date:</strong> {event.date}</i>
                                    </div>
                                    <div className="ml-auto flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(event.id)}
                                            className="bg-yellow-500 text-white p-1 rounded pr-4"
                                        >
                                            Edit
                                        </button> &nbsp; &nbsp;
                                        <button
                                            onClick={() => handleDelete(event.id)}
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

export default EventList;
