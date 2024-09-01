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
  const [cim, setCim] = useState("");
  const [helyszin, setHelyszin] = useState("");
  const [idopont, setIdopont] = useState("");
  const [ar, setAr] = useState(0);
  const [temakor, setTemakor] = useState("");
  const [leiras, setLeiras] = useState("");
  const [szoveg, setSzoveg] = useState("");
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
      setSzoveg(course.szoveg || "");
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
    data.append('szoveg', szoveg);
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-secondary p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-center mb-6">Update Course</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Left Side Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-xl mb-2">Cím:</label>
                <input
                  type="text"
                  value={cim}
                  onChange={(e) => setCim(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block font-bold text-xl mb-2">Helyszín:</label>
                <input
                  type="text"
                  value={helyszin}
                  onChange={(e) => setHelyszin(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block font-bold text-xl mb-2">Időpont:</label>
                <input
                  type="date"
                  value={idopont}
                  onChange={(e) => setIdopont(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block font-bold text-xl mb-2">Ár:</label>
                <input
                  type="number"
                  value={ar}
                  onChange={(e) => setAr(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block font-bold text-xl mb-2">Témakör:</label>
                <input
                  type="text"
                  value={temakor}
                  onChange={(e) => setTemakor(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block font-bold text-xl mb-2">Szöveg:</label>
                <textarea
                  name="szoveg"
                  value={szoveg}
                  onChange={(e) => setSzoveg(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  rows="4"
                />
              </div>
              <div>
                <label className="block font-bold text-xl mb-2">Videó:</label>
                <input
                  type="file"
                  name="video"
                  onChange={handleVideoChange}
                  accept="video/mp4, video/x-matroska, video/x-msvideo"
                  className="w-full"
                />
              </div>
            </div>
            
            {/* Right Side Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-xl mb-2">Leírás:</label>
                <input
                  type="text"
                  value={leiras}
                  onChange={(e) => setLeiras(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block font-bold text-xl mb-2">Felhasználók:</label>
                {felhasznalok.map((value, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={value}
                      onChange={(e) =>
                        handleArrayChange(index, e.target.value, setFelhasznalok)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleArrayRemove(index, setFelhasznalok)}
                      className="bg-red-500 text-white px-2 py-1 rounded-md"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleArrayAdd(setFelhasznalok)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Add Felhasznalo
                </button>
              </div>
              <div>
                <label className="block font-bold text-xl mb-2">Megkötések:</label>
                {megkotesek.map((value, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={value}
                      onChange={(e) =>
                        handleArrayChange(index, e.target.value, setMegkotesek)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleArrayRemove(index, setMegkotesek)}
                      className="bg-red-500 text-white px-2 py-1 rounded-md"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleArrayAdd(setMegkotesek)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Add Megkotes
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={!isFileValid}
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Update
            </button>
          </div>
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
