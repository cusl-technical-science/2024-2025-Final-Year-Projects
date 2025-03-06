
import React, { useState } from "react";
import Layout from "../components/Layout";
import AddEvent from "../components/AddEvent";
import EventList from "../components/EventList";

const Events = () => {
    const [newEvent, setNewEvent] = useState(null);

    // Callback to update the event list when a new event is added
    const handleNewEvent = (event) => {
        setNewEvent(event);
    };

    return (
        <Layout>
            <div className="p-8 bg-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Events</h2>
                    <AddEvent onNewEvent={handleNewEvent} />  {/* Button to add new event */}
                </div>
                <EventList event={newEvent} />  {/* Event list component */}
            </div>
        </Layout>
    );
};

export default Events;
