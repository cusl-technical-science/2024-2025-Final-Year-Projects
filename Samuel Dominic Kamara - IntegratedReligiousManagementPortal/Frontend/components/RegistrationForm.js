import React, { useState, useEffect } from "react";

const RegistrationForm = ({
                              section,
                              closeForm,
                              userId,
                              onNewSubSection,
                              editingSubSection = null,
                              memberType, // Add memberType as a prop
                          }) => {
    const [formData, setFormData] = useState(
        editingSubSection || {
            churchOrMosqueName: "",
            state: "",
            city: "",
            address: "",
            contactPerson: "",
            role: "",
            phoneNumber: "",
            email: "",
            registrationNumber: "",
            dateOfEstablishment: "",
            numberOfMembers: "",
            numberOfDepartments: "",
            numberOfStaff: "",
            agreeToTerms: false,
            section: section, // Default section
        }
    );

    useEffect(() => {
        if (editingSubSection) {
            setFormData({
                ...editingSubSection,
                dateOfEstablishment: editingSubSection.dateOfEstablishment
                    ? new Date(editingSubSection.dateOfEstablishment).toISOString().substr(0, 10) // Ensure date is formatted correctly for input fields
                    : "",
            });
        }
    }, [editingSubSection]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation for "Terms and Conditions"
        if (!editingSubSection && !formData.agreeToTerms) {
            alert("You must agree to the terms and conditions before submitting.");
            return;
        }

        const url = editingSubSection
            ? `http://localhost:8080/api/v1/users/subsections/${editingSubSection.id}`
            : `http://localhost:8080/api/v1/users/${userId}/subsections`;

        try {
            const response = await fetch(url, {
                method: editingSubSection ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                if (onNewSubSection) {
                    onNewSubSection(data); // Call the function only if it exists
                }
                alert(
                    editingSubSection
                        ? "Subsection updated successfully!"
                        : "Registration details saved successfully!"
                );
                closeForm();
            } else {
                alert("Failed to save registration details.");
            }
        } catch (error) {
            alert("Error saving registration details: " + error.message);
        }
    };

    // Determine the label dynamically
    const labelForSection = memberType === "Muslim"
        ? `Name of  ${section} Mosque`
        : `Name of ${section} Church`;

    // const labelForSection = (
    //     <span>
    //     Name of <strong>{section}</strong>{" "}
    //         {memberType === "Muslim" ? "Mosque" : "Church"}
    // </span>
    // );


    return (
        <div className="fixed inset-0 z-10 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-white w-full max-w-6xl p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
                <h3 className="text-lg font-medium mb-4 text-center">
                    {editingSubSection ? "Edit Subsection" : "Register Details"}
                </h3>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {/* Basic Information */}
                        <div className="col-span-3">
                            <label className="block text-sm font-medium mb-1">
                                {labelForSection}
                            </label>
                            <input
                                type="text"
                                name="churchOrMosqueName"
                                value={formData.churchOrMosqueName}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>


                        {/* Location Details */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                State/Province
                            </label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">City/Town</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Physical Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        {/* Contact Information */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Contact Person Name
                            </label>
                            <input
                                type="text"
                                name="contactPerson"
                                value={formData.contactPerson}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Position/Role
                            </label>
                            <input
                                type="text"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Phone Numbers
                            </label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        {/* Registration Details */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Registration Number
                            </label>
                            <input
                                type="text"
                                name="registrationNumber"
                                value={formData.registrationNumber}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Date of Establishment
                            </label>
                            <input
                                type="date"
                                name="dateOfEstablishment"
                                value={formData.dateOfEstablishment}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        {/* Membership Information */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Approximate Number of Members
                            </label>
                            <input
                                type="number"
                                name="numberOfMembers"
                                value={formData.numberOfMembers}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Number of Departments/Groups
                            </label>
                            <input
                                type="number"
                                name="numberOfDepartments"
                                value={formData.numberOfDepartments}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Number of Staff
                            </label>
                            <input
                                type="number"
                                name="numberOfStaff"
                                value={formData.numberOfStaff}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        {/* Terms and Conditions */}
                        {!editingSubSection && (
                            <div className="col-span-3">
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        name="agreeToTerms"
                                        checked={formData.agreeToTerms}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    I agree to the terms and conditions of the Integrated Religious
                                    Management System (IRMS)
                                </label>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-400 text-white rounded-md"
                            onClick={closeForm}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                            {editingSubSection ? "Update" : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegistrationForm;
