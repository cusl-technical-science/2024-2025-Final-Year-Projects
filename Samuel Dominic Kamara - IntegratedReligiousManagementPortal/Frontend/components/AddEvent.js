
import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";
import EventList from "./EventList";

const AddEvent = ({ onNewEvent }) => {
    const EVENT_API_BASE_URL = "http://localhost:8080/api/v1/events";

    const [isOpen, setIsOpen] = useState(false);
    const [event, setEvent] = useState({
        title: "",
        description: "",
        location: "",
        date: "",
    });

    const [responseEvent, setResponseEvent] = useState(null);

    function closeModal() {
        setIsOpen(false);
    }

    function openModal() {
        setIsOpen(true);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEvent((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const saveEvent = async (e) => {
        e.preventDefault();

        const eventToSave = {
            title: event.title,
            description: event.description,
            location: event.location,
            date: event.date,
        };

        try {
            const response = await fetch(EVENT_API_BASE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(eventToSave),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error("Server error:", errorMessage);
                throw new Error("Failed to save event");
            }

            const _event = await response.json();
            setResponseEvent(_event);
            onNewEvent(_event);  // Send the new event to parent
            reset();
            closeModal();  // Close modal after successful event creation
        } catch (error) {
            console.error("Error in saveEvent:", error.message);
        }
    };

    const reset = () => {
        setEvent({
            title: "",
            description: "",
            location: "",
            date: "",
        });
    };

    return (
        <>
            <button onClick={openModal} className="bg-blue-600 text-white p-2 rounded">
                Add Event
            </button>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
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
                            <div className="inline-block w-full max-w-md p-6 my-8 bg-white shadow-xl rounded-md">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                    Add Event
                                </Dialog.Title>
                                <div className="mt-2">
                                    <form onSubmit={saveEvent}>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Event Title</label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={event.title}
                                                onChange={handleChange}
                                                className="mt-2 p-2 w-full border border-gray-300 rounded"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Description</label>
                                            <textarea
                                                name="description"
                                                value={event.description}
                                                onChange={handleChange}
                                                className="mt-2 p-2 w-full border border-gray-300 rounded"
                                            ></textarea>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Location</label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={event.location}
                                                onChange={handleChange}
                                                className="mt-2 p-2 w-full border border-gray-300 rounded"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">Date</label>
                                            <input
                                                type="date"
                                                name="date"
                                                value={event.date}
                                                onChange={handleChange}
                                                className="mt-2 p-2 w-full border border-gray-300 rounded"
                                            />
                                        </div>
                                        <div className="flex justify-end space-x-4">
                                            <button type="button" onClick={closeModal} className="bg-gray-400 text-white p-2 rounded">
                                                Cancel
                                            </button>
                                            <button type="submit" className="bg-blue-600 text-white p-2 rounded">
                                                Save
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

export default AddEvent;
