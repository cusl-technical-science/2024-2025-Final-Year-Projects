import { Dialog, Transition } from "@headlessui/react";
import React, { useState, useEffect, Fragment } from "react";

const EditUser = ({ userId, setResponseUser }) => {
  const USER_API_BASE_URL = "http://localhost:8080/api/v1/users";

  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({
    id: "",
    firstName: "",
    lastName: "",
    emailId: "",
    memberType: "",
    section: "",
    password: "", // Added password field
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(USER_API_BASE_URL + "/" + userId, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const _user = await response.json();
        setUser(_user);
        setIsOpen(true);
      } catch (error) {
        console.log(error);
      }
    };
    if (userId) {
      fetchData();
    }
  }, [userId]);

  function closeModal() {
    setIsOpen(false);
  }

  const handleChange = (event) => {
    const value = event.target.value;
    setUser({ ...user, [event.target.name]: value });
  };

  const getSections = () => {
    if (user.memberType === "Christian") {
      return ["Anglican", "Pentecostal"];
    } else if (user.memberType === "Muslim") {
      return ["Sunni", "Shia"];
    }
    return [];
  };

  const updateUser = async (e) => {
    e.preventDefault();
    const response = await fetch(USER_API_BASE_URL + "/" + userId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    const _user = await response.json();
    setResponseUser(_user);
    setIsOpen(false);
  };

  return (
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
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-md">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Update User
                </Dialog.Title>
                <form>
                  <div className="h-14 my-4">
                    <label className="block text-gray-600 text-sm font-normal">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={user.firstName}
                        onChange={handleChange}
                        className="h-10 w-96 border mt-2 px-2 py-2"
                    />
                  </div>
                  <div className="h-14 my-4">
                    <label className="block text-gray-600 text-sm font-normal">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={user.lastName}
                        onChange={handleChange}
                        className="h-10 w-96 border mt-2 px-2 py-2"
                    />
                  </div>
                  <div className="h-14 my-4">
                    <label className="block text-gray-600 text-sm font-normal">Email Id</label>
                    <input
                        type="email"
                        name="emailId"
                        value={user.emailId}
                        onChange={handleChange}
                        className="h-10 w-96 border mt-2 px-2 py-2"
                    />
                  </div>
                  <div className="h-14 my-4">
                    <label className="block text-gray-600 text-sm font-normal">Member Type</label>
                    <select
                        name="memberType"
                        value={user.memberType}
                        onChange={handleChange}
                        className="h-10 w-96 border mt-2 px-2 py-2"
                    >
                      <option value="">Select Member Type</option>
                      <option value="Christian">Christian</option>
                      <option value="Muslim">Muslim</option>
                    </select>
                  </div>
                  {user.memberType && (
                      <div className="h-14 my-4">
                        <label className="block text-gray-600 text-sm font-normal">Section</label>
                        <select
                            name="section"
                            value={user.section}
                            onChange={handleChange}
                            className="h-10 w-96 border mt-2 px-2 py-2"
                        >
                          <option value="">Select Section</option>
                          {getSections().map((section) => (
                              <option key={section} value={section}>
                                {section}
                              </option>
                          ))}
                        </select>
                      </div>
                  )}
                  <div className="h-14 my-4">
                    <label className="block text-gray-600 text-sm font-normal">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={user.password}
                        onChange={handleChange}
                        className="h-10 w-96 border mt-2 px-2 py-2"
                        required
                    />
                  </div>
                  <div className="h-14 my-4 space-x-4 pt-4">
                    <button
                        onClick={updateUser}
                        className="rounded text-white font-semibold bg-green-400 hover:bg-green-700 py-2 px-6"
                    >
                      Update
                    </button>
                    <button
                        onClick={closeModal}
                        className="rounded text-white font-semibold bg-red-400 hover:bg-red-700 py-2 px-6"
                    >
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
  );
};

export default EditUser;
