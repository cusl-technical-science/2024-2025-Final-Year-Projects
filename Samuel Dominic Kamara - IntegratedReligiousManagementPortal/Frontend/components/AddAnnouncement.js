import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState } from "react";

const AddAnnouncement = ({ onNewAnnouncement }) => {
    const ANNOUNCEMENT_API_BASE_URL = "http://localhost:8080/api/v1/announcements";
    const [isOpen, setIsOpen] = useState(false);
    const [announcement, setAnnouncement] = useState({
        title: "",
        description: "",
        date: "",
    });

    function closeModal() {
        setIsOpen(false);
    }

    function openModal() {
        setIsOpen(true);
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setAnnouncement({ ...announcement, [name]: value });
    };

    const saveAnnouncement = async (e) => {
        e.preventDefault();
        const response = await fetch(ANNOUNCEMENT_API_BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(announcement),
        });

        if (response.ok) {
            const _announcement = await response.json();
            onNewAnnouncement(_announcement);  // Callback for the new announcement
            closeModal();
            setAnnouncement({ title: "", description: "", date: "" });
        }
    };

    return (
        <>
            <button onClick={openModal} className="bg-blue-600 text-white p-2 rounded">
                Add Announcement
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
                                    Add Announcement
                                </Dialog.Title>
                                <div>
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={announcement.title}
                                        onChange={handleChange}
                                        className="w-full border p-2 my-2"
                                    />
                                    <label>Description</label>
                                    <textarea
                                        name="description"
                                        value={announcement.description}
                                        onChange={handleChange}
                                        className="w-full border p-2 my-2"
                                    />
                                    <label>Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={announcement.date}
                                        onChange={handleChange}
                                        className="w-full border p-2 my-2"
                                    />
                                    <button onClick={saveAnnouncement} className="bg-green-500 text-white p-2 rounded">
                                        Save
                                    </button>
                                    <button onClick={closeModal} className="bg-red-500 text-white p-2 ml-2 rounded">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

export default AddAnnouncement;
