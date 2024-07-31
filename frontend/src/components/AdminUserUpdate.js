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
        "http://localhost:3000/api/admin/updateuser",
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
    <div>
      <h1>Update User</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        {[
          { label: "Allergies", state: allergies, setter: setAllergies },
          {
            label: "Complaints",
            state: complaints,
            setter: setComplaints,
          },
          { label: "Courses", state: courses, setter: setCourses },
          { label: "Drugs", state: drugs, setter: setDrugs },
          { label: "Mutetek", state: mutetek, setter: setMutetek },
        ].map(({ label, state, setter }, i) => (
          <div key={i}>
            <label>{label}:</label>
            {state.map(([key, value], index) => (
              <div key={index}>
                <input
                  type="text"
                  placeholder="Key"
                  value={key}
                  onChange={(e) =>
                    handleJsonChange(index, e.target.value, value, setter)
                  }
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={value}
                  onChange={(e) =>
                    handleJsonChange(index, key, e.target.value, setter)
                  }
                />
                <button
                  type="button"
                  onClick={() => handleJsonRemove(index, setter)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={() => handleJsonAdd(setter)}>
              Add {label}
            </button>
          </div>
        ))}
        <div>
          <label>Amalgan Filling:</label>
          <input
            type="checkbox"
            checked={amalganFilling}
            onChange={(e) => setAmalganFilling(e.target.checked)}
          />
        </div>
        <div>
          <label>Born Date:</label>
          <input
            type="date"
            value={bornDate}
            onChange={(e) => setBornDate(e.target.value)}
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Goal:</label>
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
        </div>
        <button type="submit">Update</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminUpdate;
