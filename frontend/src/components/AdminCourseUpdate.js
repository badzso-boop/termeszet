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
    courses,
    getOneCourse,
    fetchCourses,
    stringifyJsonObject,
    parseJsonString,
    removeBackslashes,
  } = useAdmin();

  const [dataLoaded, setDataLoaded] = useState(false);

  // helyes useStatek
  const [cim, setCim] = useState("");
  const [helyszin, setHelyszin] = useState("");
  const [idopont, setIdopont] = useState("");
  const [ar, setAr] = useState(0);
  const [temakor, setTemakor] = useState("");
  const [leiras, setLeiras] = useState("");
  const [fajlok, setFajlok] = useState("");
  const [felhasznalok, setFelhasznalok] = useState([]);
  const [megkotesek, setMegkotesek] = useState([]);
  const [video, setVideo] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const course = await getOneCourse(id);
      setCim(course.cim || "");
      setHelyszin(course.helyszin || "");
      setIdopont(course.idopont || "");
      setAr(course.ar || "");
      setTemakor(course.temakor || "");
      setLeiras(course.leiras || "");
      setVideo(course.video || "");
      setFelhasznalok(
        Object.entries(
          parseJsonString(
            removeBackslashes(JSON.parse(course.felhasznalok) || "{}")
          )
        )
      );
      setMegkotesek(
        Object.entries(
          parseJsonString(
            removeBackslashes(JSON.parse(course.megkotesek) || "{}")
          )
        )
      );

      setDataLoaded(true);
    };

    if (!dataLoaded) {
      loadData();
    }
  }, [getOneCourse, dataLoaded, id]);

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
        "http://localhost:3000/api/admin/updateCourse",
        {
          userId,
          id,
          cim,
          helyszin,
          idopont,
          ar,
          temakor,
          leiras,
          felhasznalok: JSON.stringify(Object.fromEntries(felhasznalok)),
          megkotesek: JSON.stringify(Object.fromEntries(megkotesek))
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
          <label>cim:</label>
          <input
            type="text"
            value={cim}
            onChange={(e) => setCim(e.target.value)}
            required
          />
        </div>
        <div>
          <label>helyszin:</label>
          <input
            type="text"
            value={helyszin}
            onChange={(e) => setHelyszin(e.target.value)}
          />
        </div>
        <div>
          <label>idopont:</label>
          <input
            type="text"
            value={idopont}
            onChange={(e) => setIdopont(e.target.value)}
          />
        </div>
        {[
          { label: "Felhasznalok", state: felhasznalok, setter: setFelhasznalok },
          { label: "Megkötesek", state: megkotesek, setter: setMegkotesek, }
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
          <label>ar:</label>
          <input
            type="number"
            checked={ar}
            onChange={(e) => setAr(e.target.value)}
          />
        </div>
        <div>
          <label>temakor:</label>
          <input
            type="text"
            value={temakor}
            onChange={(e) => setTemakor(e.target.value)}
          />
        </div>
        <div>
          <label>leiras:</label>
          <input
            type="text"
            value={leiras}
            onChange={(e) => setLeiras(e.target.value)}
          />
        </div>
        <button type="submit">Update</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminUpdate;
