import { useState } from "react";

const EditAnnouncement = ({ announcement, onSave }) => {
    const [title, setTitle] = useState(announcement.title);
    const [description, setDescription] = useState(announcement.description);
    const [date, setDate] = useState(announcement.date ? announcement.date : ""); // Initialize with existing date

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...announcement, title, description, date });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Title</label>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-2 my-2"
            />
            <label>Description</label>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border p-2 my-2"
            />
            <label>Date</label>
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border p-2 my-2"
            />
            <button type="submit" className="bg-green-500 text-white p-2 rounded">
                Save Changes
            </button>
        </form>
    );
};

export default EditAnnouncement;
