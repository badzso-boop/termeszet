import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Assuming axios is being used
import { useAuth } from "../context/AuthContext";

const AdminCreate = () => {
  const { rang, userId } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cim: '',
    ar: '',
    helyszin: '',
    idopont: '',
    video: null,
    temakor: '',
    leiras: '',
    szoveg: '',
  });
  const [message, setMessage] = useState('');
  const [isFileValid, setIsFileValid] = useState(true);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (rang !== 'a') {
      navigate('/');
    }
  }, [rang, navigate]);

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;

    if (type === 'file') {
      const file = files[0];
      const fileTypes = ['video/mp4', 'video/x-matroska', 'video/x-msvideo'];
      if (file && fileTypes.includes(file.type)) {
        setIsFileValid(true);
        setMessage('');
        setFormData({ ...formData, [name]: file });
      } else {
        setIsFileValid(false);
        setMessage('Csak videó fájlokat tölthetsz fel (mp4, mkv, avi).');
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    data.append('userId', userId);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/admin/createCourse`, data);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Something went wrong.');
    }
  };

  return (
    <div className="flex bg-gray-100 items-center justify-center min-h-screen">
      <div className="bg-secondary p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-center mb-6">Kurzus létrehozása</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div>
                <label className="block font-bold text-xl mb-2">Cím:</label>
                <input
                  type="text"
                  name="cim"
                  value={formData.cim}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block font-bold text-xl mb-2">Ár:</label>
                <input
                  type="number"
                  name="ar"
                  value={formData.ar}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block font-bold text-xl mb-2">Helyszín:</label>
                <input
                  type="text"
                  name="helyszin"
                  value={formData.helyszin}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block font-bold text-xl mb-2">Időpont:</label>
                <input
                  type="date"
                  name="idopont"
                  value={formData.idopont}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block font-bold text-xl mb-2">Témakör:</label>
                <input
                  type="text"
                  name="temakor"
                  value={formData.temakor}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block font-bold text-xl mb-2">Videó:</label>
                <input
                  type="file"
                  name="video"
                  onChange={handleChange}
                  accept="video/mp4, video/x-matroska, video/x-msvideo"
                  className="w-full"
                />
              </div>
            </div>
            
            <div>
              <div>
                <label className="block font-bold text-xl mb-2">Leírás:</label>
                <textarea
                  name="leiras"
                  value={formData.leiras}
                  onChange={handleChange}
                  className="w-full h-32 px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block font-bold text-xl mb-2">Szöveg:</label>
                <textarea
                  name="szoveg"
                  value={formData.szoveg}
                  onChange={handleChange}
                  className="w-full h-32 px-4 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              disabled={!isFileValid}
              className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Kurzus létrehozása
            </button>
          </div>
        </form>
        <div className='flex justify-center'>
        {message && <p className="text-center bg-green-500 w-1/3 mt-4 rounded-lg">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminCreate;
