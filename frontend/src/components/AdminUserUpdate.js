import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useAdmin } from "../context/AdminContext";

const AdminUpdate = (type) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { rang, userId } = useAuth();
  const {
    getOneUser,
    stringifyJsonObject,
    parseJsonString,
    removeBackslashes,
  } = useAdmin();

  const [dataLoaded, setDataLoaded] = useState(false);

  // User states
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [allergies, setAllergies] = useState([]);
  const [amalganFilling, setAmalganFilling] = useState(false);
  const [bornDate, setBornDate] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [courses, setCourses] = useState([]);
  const [description, setDescription] = useState("");
  const [drugs, setDrugs] = useState([]);
  const [goal, setGoal] = useState("");
  const [mutetek, setMutetek] = useState([]);
  const [message, setMessage] = useState("");

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const loadData = async () => {
      const beUser = await getOneUser(id);
      const userData = beUser.data.user;

      setEmail(userData.email || "");
      setUsername(userData.username || "");
      setFullName(userData.fullName || "");
      setAllergies(
        Object.entries(
          parseJsonString(
            removeBackslashes(JSON.parse(userData.allergies) || "{}")
          )
        )
      );
      setAmalganFilling(userData.amalganFilling || false);
      setBornDate(userData.bornDate || "");
      setComplaints(
        Object.entries(
          parseJsonString(
            removeBackslashes(JSON.parse(userData.complaints) || "{}")
          )
        )
      );
      setCourses(
        Object.entries(
          parseJsonString(
            removeBackslashes(JSON.parse(userData.courses) || "{}")
          )
        )
      );
      setDescription(userData.description || "");
      setDrugs(
        Object.entries(
          parseJsonString(removeBackslashes(JSON.parse(userData.drugs) || "{}"))
        )
      );
      setGoal(userData.goal || "");
      setMutetek(
        Object.entries(
          parseJsonString(
            removeBackslashes(JSON.parse(userData.mutetek) || "{}")
          )
        )
      );

      setDataLoaded(true);
    };

    if (!dataLoaded) {
      loadData();
    }
  }, [getOneUser, dataLoaded, id]);

  useEffect(() => {
    if (rang !== "a") {
      navigate("/");
    }
  }, [rang, navigate]);

  const handleJsonChange = (index, key, value, setter) => {
    setter((prev) => {
      const newArray = [...prev];
      newArray[index] = [key, value];
      return newArray;
    });
  };

  const handleJsonAdd = (setter) => {
    setter((prev) => [...prev, ["", ""]]);
  };

  const handleJsonRemove = (index, setter) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/admin/updateuser`,
        {
          userId,
          id,
          email,
          username,
          fullName,
          allergies: JSON.stringify(Object.fromEntries(allergies)),
          amalganFilling,
          bornDate,
          complaints: JSON.stringify(Object.fromEntries(complaints)),
          courses: JSON.stringify(Object.fromEntries(courses)),
          description,
          drugs: JSON.stringify(Object.fromEntries(drugs)),
          goal,
          mutetek: JSON.stringify(Object.fromEntries(mutetek)),
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-secondary p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">Update User</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-bold text-xl mb-2 text-white">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block font-bold text-xl mb-2 text-white">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block font-bold text-xl mb-2 text-white">Full Name:</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          {[
            { label: "Allergies", state: allergies, setter: setAllergies },
            { label: "Complaints", state: complaints, setter: setComplaints },
            { label: "Courses", state: courses, setter: setCourses },
            { label: "Drugs", state: drugs, setter: setDrugs },
            { label: "Mutetek", state: mutetek, setter: setMutetek },
          ].map(({ label, state, setter }, i) => (
            <div key={i} className="space-y-2">
              <label className="block font-bold text-xl mb-2 text-white">{label}:</label>
              {state.map(([key, value], index) => (
                <div key={index} className="flex space-x-2 items-center mb-2">
                  <input
                    type="text"
                    placeholder="Key"
                    value={key}
                    onChange={(e) =>
                      handleJsonChange(index, e.target.value, value, setter)
                    }
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={value}
                    onChange={(e) =>
                      handleJsonChange(index, key, e.target.value, setter)
                    }
                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleJsonRemove(index, setter)}
                    className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleJsonAdd(setter)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Add {label}
              </button>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <label className="font-bold text-xl text-white">Amalgan Filling:</label>
            <input
              type="checkbox"
              checked={amalganFilling}
              onChange={(e) => setAmalganFilling(e.target.checked)}
              className="form-checkbox"
            />
          </div>
          <div>
            <label className="block font-bold text-xl mb-2 text-white">Born Date:</label>
            <input
              type="date"
              value={bornDate}
              onChange={(e) => setBornDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block font-bold text-xl mb-2 text-white">Description:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block font-bold text-xl mb-2 text-white">Goal:</label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600"
          >
            Update
          </button>
        </form>
        {message && (
          <p className="bg-green-500 text-white rounded-lg p-4 mt-4 text-center">
            {message}
          </p>
        )}
      </div>
    </div>
  );  
};

export default AdminUpdate;
