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
    getOneCourse,
  } = useAdmin();

  const [dataLoaded, setDataLoaded] = useState(false);

  // Initialize states
  const [cim, setCim] = useState("");
  const [helyszin, setHelyszin] = useState("");
  const [idopont, setIdopont] = useState("");
  const [ar, setAr] = useState(0);
  const [temakor, setTemakor] = useState("");
  const [leiras, setLeiras] = useState("");
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
      setAr(course.ar);
      setTemakor(course.temakor || "");
      setLeiras(course.leiras || "");
      setVideo(course.video || "");

      setFelhasznalok(JSON.parse(course.felhasznalok || "[]").map(Number));
      setMegkotesek(JSON.parse(course.megkotesek || "[]").map(Number));

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

  const handleArrayChange = (index, value, setter) => {
    setter((prev) => {
      const newArray = [...prev];
      newArray[index] = value;
      return newArray;
    });
  };

  const handleArrayAdd = (setter) => {
    setter((prev) => [...prev, ""]);
  };

  const handleArrayRemove = (index, setter) => {
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
          felhasznalok,
          megkotesek
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div>
      <h1>Update Course</h1>
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
            type="date"
            value={idopont}
            onChange={(e) => setIdopont(e.target.value)}
          />
        </div>
        <div>
          <label>Felhasznalok:</label>
          {felhasznalok.map((value, index) => (
            <div key={index}>
              <input
                type="text"
                value={value}
                onChange={(e) =>
                  handleArrayChange(index, e.target.value, setFelhasznalok)
                }
              />
              <button
                type="button"
                onClick={() => handleArrayRemove(index, setFelhasznalok)}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={() => handleArrayAdd(setFelhasznalok)}>
            Add Felhasznalo
          </button>
        </div>
        <div>
          <label>Megkotesek:</label>
          {megkotesek.map((value, index) => (
            <div key={index}>
              <input
                type="text"
                value={value}
                onChange={(e) =>
                  handleArrayChange(index, e.target.value, setMegkotesek)
                }
              />
              <button
                type="button"
                onClick={() => handleArrayRemove(index, setMegkotesek)}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={() => handleArrayAdd(setMegkotesek)}>
            Add Megkotes
          </button>
        </div>
        <div>
          <label>ar:</label>
          <input
            type="number"
            value={ar}
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
