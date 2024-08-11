import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useAdmin } from "../context/AdminContext";

const AdminUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { rang, userId } = useAuth();
  const { getOneCourse } = useAdmin();

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
  const [video, setVideo] = useState(null);
  const [isFileValid, setIsFileValid] = useState(true);
  const [message, setMessage] = useState("");

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

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

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    const fileTypes = ['video/mp4', 'video/x-matroska', 'video/x-msvideo'];
    if (file && fileTypes.includes(file.type)) {
      setIsFileValid(true);
      setVideo(file);
      setMessage('');
    } else {
      setIsFileValid(false);
      setMessage('Csak videó fájlokat tölthetsz fel (mp4, mkv, avi).');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('userId', userId);
    data.append('id', id);
    data.append('cim', cim);
    data.append('helyszin', helyszin);
    data.append('idopont', idopont);
    data.append('ar', ar);
    data.append('temakor', temakor);
    data.append('leiras', leiras);
    data.append('felhasznalok', JSON.stringify(felhasznalok));
    data.append('megkotesek', JSON.stringify(megkotesek));
    if (video) {
      data.append('video', video);
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/api/admin/updateCourse`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div>
      <h1>Update Course</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Cím:</label>
          <input
            type="text"
            value={cim}
            onChange={(e) => setCim(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Helyszín:</label>
          <input
            type="text"
            value={helyszin}
            onChange={(e) => setHelyszin(e.target.value)}
          />
        </div>
        <div>
          <label>Időpont:</label>
          <input
            type="date"
            value={idopont}
            onChange={(e) => setIdopont(e.target.value)}
          />
        </div>
        <div>
          <label>Felhasználók:</label>
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
          <label>Megkötések:</label>
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
          <label>Ár:</label>
          <input
            type="number"
            value={ar}
            onChange={(e) => setAr(e.target.value)}
          />
        </div>
        <div>
          <label>Témakör:</label>
          <input
            type="text"
            value={temakor}
            onChange={(e) => setTemakor(e.target.value)}
          />
        </div>
        <div>
          <label>Leírás:</label>
          <input
            type="text"
            value={leiras}
            onChange={(e) => setLeiras(e.target.value)}
          />
        </div>
        <div>
          <label>Videó:</label>
          <input
            type="file"
            name="video"
            onChange={handleVideoChange}
            accept="video/mp4, video/x-matroska, video/x-msvideo"
          />
        </div>
        <button type="submit" disabled={!isFileValid}>
          Update
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminUpdate;
